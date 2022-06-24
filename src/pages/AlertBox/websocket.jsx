import { useEffect, useRef } from "react";

import io from "socket.io-client";
import api from "../../services/api";

import { useSearchParams } from "react-router-dom";

const WebSocket = async (token, callback = () => {}, setSettings = () => {}) => {
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
        setSettings(settings);

        const jwt = await api.wasd.getJWTToken();
        const profileInfo = await api.wasd.getProfileInfo(user_id);

        if (intervalId) {
          clearInterval(intervalId);
        }
        startFetchRaid(profileInfo.user_profile.channel_id, settings, {
          profileInfo,
          jwt,
        });

        console.log(`Попытка подключения: ${profileInfo.user_profile.user_login} (ID: ${profileInfo.user_profile.channel_id})`);

        socketRef.current = io("wss://chat.wasd.tv/", {
          transports: ["websocket"],
          query: {
            path: "/socket.io",
            EIO: 3,
          },
        });

        socketRef.current.on("connect_error", (err) => {
          console.log(`Ошибка подключения.`);
        });

        socketRef.current.on("connect", async () => {
          const streamId = await api.wasd.getStreamId(profileInfo.user_profile.channel_id);
          if (!streamId) return;
          console.log(`StreamID: ${streamId}`);
          socketRef.current.emit("join", {
            streamId,
            channelId: profileInfo.user_profile.channel_id,
            jwt: jwt,
            excludeStickers: true,
          });
        });

        socketRef.current.on("disconnect", () => {
          console.log("Отключено");
        });

        socketRef.current.on("event", (data) => {
          setTimeout(() => {
            if (data.event_type === "NEW_FOLLOWER" && (isAll || follows) && !lastFollowers[data.payload.user_login]) {
              lastFollowers[data.payload.user_login] = 1;

              console.log("Последние добавления в избранное", lastFollowers);

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

        socketRef.current.on("subscribe", (data) => {
          setTimeout(() => {
            if (isAll || subscriptions) {
              callback({
                event: "SUBSCRIBE",
                payload: { ...data, ...settings },
              });
            }
          }, settings.alert_delay);
        });

        socketRef.current.on("joined", (msg) => {
          console.log("Присоединился, роль:", msg.user_channel_role);
        });
      } catch (e) {
        console.log(`Я попробую переподключиться через 10 секунд.`);
        setTimeout(() => init(), 1000 * 10);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startFetchRaid = async (channel_id, settings, info) => {
    const { profileInfo, jwt } = info;
    let lastRaid = null;
    let lastStreamId = await api.wasd.getStreamId(profileInfo.user_profile.channel_id);

    const fetchRaid = async () => {
      const channelInfo = await api.wasd.getChannelInfoById(channel_id);

      try {
        if (!channelInfo.media_container || !channelInfo.media_container.media_container_streams) return console.log("Поток не запущен");
        const newStreamId = channelInfo.media_container.media_container_streams[0].stream_id;

        if (newStreamId !== lastStreamId) {
          socketRef.current.emit("leave", { streamId: lastStreamId });

          setTimeout(() => {
            socketRef.current.emit("join", {
              streamId: newStreamId,
              channelId: profileInfo.user_profile.channel_id,
              jwt: jwt,
              excludeStickers: true,
            });
            lastStreamId = newStreamId;
          }, 150);

          return;
        }

        if (isAll || raids) {
          const isRaid = channelInfo.channel.raid_info;

          if (isRaid && !(lastRaid && lastRaid.begin_at === isRaid.begin_at && lastRaid.raid_mc_id === isRaid.raid_mc_id)) {
            lastRaid = isRaid;
            setTimeout(() => {
              callback({
                event: "RAID",
                payload: {
                  ...isRaid,
                  ...settings,
                },
              });
            }, settings.alert_delay);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchRaid();
    intervalId = setInterval(() => fetchRaid(), 30000);
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
