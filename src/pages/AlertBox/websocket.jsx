import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import io from "socket.io-client";

import api from "../../services/api/index.js";

const WebSocket = async (callback = () => {}, user_id, settings) => {
  const socketRef = useRef(null);
  const data = useRef(null);
  data.current = { user_id: user_id, settings: settings };

  const [searchParams] = useSearchParams();
  const follows = !!searchParams.get("follows");
  const subscriptions = !!searchParams.get("subscriptions");
  const resubs = !!searchParams.get("resubs");
  const paid_message = !!searchParams.get("paid_message");
  const raids = !!searchParams.get("raids");

  const isAll = !subscriptions && !resubs && !follows && !paid_message && !raids;

  let lastFollowers = {};
  let intervalId = null;

  useEffect(() => {
    const init = async () => {
      try {
        if (!data.current.user_id) throw Object.assign(new Error("Не удалось получит user_id"), { code: "USER_ID_NOT_FOUND" });

        const jwt = await api.wasd.getJWTToken();
        const profileInfo = await api.wasd.getProfileInfo(data.current.user_id);

        if (intervalId) clearInterval(intervalId);
        startFetchRaid(profileInfo.user_profile.channel_id, data.current.settings, { profileInfo, jwt });

        console.log(`Попытка подключения: ${profileInfo.user_profile.user_login} (ID: ${profileInfo.user_profile.channel_id})`);

        socketRef.current = io("wss://chat.wasd.tv/", { transports: ["websocket"], query: { path: "/socket.io", EIO: 3 } });

        socketRef.current.on("connect_error", () => console.log(`Ошибка подключения.`));

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

        socketRef.current.on("disconnect", () => console.log("Отключено"));

        socketRef.current.on("event", (event) => {
          setTimeout(() => {
            if (event.event_type === "NEW_FOLLOWER" && (isAll || follows)) {
              if (lastFollowers[event.payload.user_login]) return;

              lastFollowers[event.payload.user_login] = 1;
              console.log("Последние добавления в избранное", lastFollowers);

              callback({ event: event.event_type, payload: { ...event, ...data.current.settings } });
            }
          }, data.current.settings.alert_delay);
        });

        socketRef.current.on("subscribe", (event) => {
          setTimeout(() => {
            if (isAll || subscriptions) {
              callback({ event: "SUBSCRIBE", payload: { ...event, ...data.current.settings } });
            }
          }, data.current.settings.alert_delay);
        });

        socketRef.current.on("paidMessage", (event) => {
          setTimeout(() => {
            if (isAll || paid_message) {
              callback({ event: "paidMessage", payload: { ...event, ...data.current.settings } });
            }
          }, data.current.settings.alert_delay);
        });

        socketRef.current.on("joined", (msg) => console.log("Присоединился, роль:", msg.user_channel_role));
      } catch (e) {
        if (e.code === "USER_ID_NOT_FOUND") {
          return setTimeout(() => init(), 50);
        } else {
          console.log(`Я попробую переподключиться через 10 секунд.`);
          setTimeout(() => init(), 1000 * 10);
        }
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
        if (!channelInfo.media_container || !channelInfo.media_container.media_container_streams) return console.log("Поток не запущен.");
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

export default WebSocket;
