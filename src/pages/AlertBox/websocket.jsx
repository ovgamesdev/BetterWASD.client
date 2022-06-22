import { useEffect, useRef } from "react";

import io from "socket.io-client";
import api from "../../services/api";

import { useSearchParams } from "react-router-dom";

const WebSocket = async (token, callback = () => {}) => {
  const socketRef = useRef(null);

  const [searchParams] = useSearchParams();

  const follows = !!searchParams.get("follows");
  const subscriptions = !!searchParams.get("subscriptions");
  const resubs = !!searchParams.get("resubs");
  const raids = !!searchParams.get("raids");

  const isAll = !subscriptions && !resubs && !follows && !raids;

  let lastFollowers = {};
  let intervalId = null;

  useEffect(() => {
    const init = async () => {
      try {
        const { user_id, settings } = await fetchData(token);

        const jwt = await api.wasd.getJWTToken();
        const profileInfo = await api.wasd.getProfileInfo(user_id);
        const streamId = await api.wasd.getStreamId(profileInfo.user_profile.channel_id);

        if (intervalId) {
          clearInterval(intervalId);
        }
        startFetchRaid(profileInfo.user_profile.channel_id, settings, {
          streamId,
          profileInfo,
          jwt,
        });

        console.log(
          `Trying to connect:\n${profileInfo.user_profile.user_login} (ID: ${profileInfo.user_profile.channel_id}) | StreamID: ${streamId}`
        );

        socketRef.current = io("wss://chat.wasd.tv/", {
          transports: ["websocket"],
          query: {
            path: "/socket.io",
            EIO: 3,
          },
        });

        socketRef.current.on("connect_error", (err) => {
          console.log(`I'll try to reconnect in 10 seconds.`);
          setTimeout(() => {
            init();
          }, 1000 * 10);
        });

        socketRef.current.on("connect", () => {
          socketRef.current.emit("join", {
            streamId,
            channelId: profileInfo.user_profile.channel_id,
            jwt: jwt,
            excludeStickers: true,
          });
        });

        socketRef.current.on("event", (data) => {
          setTimeout(() => {
            if (data.event_type === "NEW_FOLLOWER" && (isAll || follows) && !lastFollowers[data.payload.user_login]) {
              lastFollowers[data.payload.user_login] = 1;

              console.log(lastFollowers);

              callback({
                event: data.event_type,
                payload: {
                  ...data,
                  ...settings,
                },
              });
            }
          }, settings.alert_delay);
        });

        socketRef.current.on("disconnect", () => {
          console.log("disconnect");
        });

        socketRef.current.on("subscribe", (data) => {
          setTimeout(() => {
            if (isAll || subscriptions) {
              callback({
                event: "SUBSCRIBE",
                payload: { ...data, ...settings },
              });
            }
          }, settings.alert_delay);

          // console.log("subscribe", data);
          // channel_id: 111
          // other_roles: []
          // product_code: "subscription_v2"
          // product_name: "subscription_v2"
          // user_id: 000
          // user_login: "userlogin"
          // validity_months: 1
        });

        socketRef.current.on("joined", (msg) => {
          console.log("joined", msg);
        });

        socketRef.current.on("system_message", (msg) => {
          console.log(msg);
        });
      } catch (e) {
        console.log(`I'll try to reconnect in 10 seconds.`);
        setTimeout(() => init(), 1000 * 10);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startFetchRaid = (channel_id, settings, info) => {
    const { streamId, profileInfo, jwt } = info;
    let lastRaid = null;
    let lastStreamId = streamId;

    const fetchRaid = async () => {
      const channelInfo = await api.wasd.getChannelInfoById(channel_id);

      try {
        const newStreamId = channelInfo.media_container.media_container_streams[0].stream_id;

        if (newStreamId !== lastStreamId) {
          socketRef.current.emit("leave", { streamId: lastStreamId });

          socketRef.current.emit("join", {
            streamId: newStreamId,
            channelId: profileInfo.user_profile.channel_id,
            jwt: jwt,
            excludeStickers: true,
          });
          lastStreamId = newStreamId;

          return;
        }

        if (isAll || raids) {
          const isRaid = channelInfo.channel.raid_info;

          if (isRaid && !(lastRaid && lastRaid.begin_at === isRaid.begin_at && lastRaid.raid_mc_id === isRaid.raid_mc_id)) {
            lastRaid = isRaid;
            callback({
              event: "RAID",
              payload: {
                ...isRaid,
                ...settings,
              },
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    setTimeout(() => {
      fetchRaid();
      intervalId = setInterval(() => fetchRaid(), 30000); // 30000
    }, settings.alert_delay);
  };
};

const fetchData = async (token) =>
  new Promise(async (resolve) => {
    try {
      const { data: jdata } = await api.auth.getAlertSettingsByToken(token);
      document.documentElement.style.setProperty("--alert-bg", jdata.settings.background_color);
      resolve(jdata);
    } catch (e) {
      resolve(new Error("Сервер не отвечает"));
    }
  });

export default WebSocket;
