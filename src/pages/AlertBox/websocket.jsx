import { useEffect, useRef, useState } from "react";

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

  console.log(isAll);

  useEffect(() => {
    const init = async () => {
      try {
        const { user_id, settings } = await fetchData(token);

        socketRef.current = io("wss://chat.wasd.tv/", {
          transports: ["websocket"],
          query: {
            path: "/socket.io",
            EIO: 3,
          },
        });

        const jwt = await api.wasd.getJWTToken();
        const profileInfo = await api.wasd.getProfileInfo(user_id);
        const streamId = await api.wasd.getStreamId(
          profileInfo.user_profile.channel_id
        );

        if (isAll || raids) {
          startFetchRaid(profileInfo.user_profile.channel_id, settings);
        }

        socketRef.current.emit("join", {
          streamId,
          channelId: profileInfo.user_profile.channel_id,
          jwt: jwt,
          excludeStickers: true,
        });

        socketRef.current.on("connect", () => {
          console.log("connect");
        });

        console.log(settings);

        socketRef.current.on("event", (data) => {
          setTimeout(() => {
            if (
              data.event_type === "NEW_FOLLOWER" &&
              (isAll || follows) &&
              !lastFollowers[data.payload.user_login]
            ) {
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
            if (data.event_type === "SUBSCRIBE" && (isAll || subscriptions)) {
              callback({
                event: data.event_type,
                payload: { ...data, ...settings },
              });
            }
          }, settings.alert_delay);

          // console.log("subscribe", data);
          // channel_id: 1189167
          // other_roles: []
          // product_code: "subscription_v2"
          // product_name: "subscription_v2"
          // user_id: 1323549
          // user_login: "Naeber"
          // validity_months: 1
        });

        socketRef.current.on("joined", (msg) => {
          console.log("joined", msg);
        });

        // socketRef.current.on("message", function (msg) {
        //   console.log("message", msg);
        // });

        socketRef.current.on("system_message", (msg) => {
          console.log(msg);
        });
      } catch (e) {
        console.log(e);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startFetchRaid = (channel_id, settings) => {
    let lastRaid = null;

    const fetchRaid = async () => {
      const isRaid = await api.auth.getRaidInfo(channel_id);

      if (
        isRaid &&
        !(
          lastRaid &&
          lastRaid.begin_at === isRaid.begin_at &&
          lastRaid.raid_mc_id === isRaid.raid_mc_id
        )
      ) {
        lastRaid = isRaid;
        callback({
          event: "RAID",
          payload: {
            ...isRaid,
            ...settings,
          },
        });
      }
    };

    fetchRaid();
    setInterval(() => fetchRaid(), 30000); // 30000
  };
};

const fetchData = async (token) =>
  new Promise(async (resolve) => {
    try {
      const { data: jdata } = await api.auth.getAlertSettingsByToken(token);
      // document.body.style.backgroundColor = jdata.settings.background_color;
      resolve(jdata);
    } catch (e) {
      console.log(e);
    } finally {
      resolve();
    }
  });

export default WebSocket;
