import { useEffect, useRef } from "react";
import io from "socket.io-client";

import api from "../../services/api/index.js";

const WebSocket = async (callback = () => {}, user_id, settings, { maxMessages }) => {
  const socketRef = useRef(null);
  const data = useRef(null);
  const isShowHi = useRef(false);
  data.current = { user_id: user_id, settings: settings };

  const follows = true;
  const subscriptions = true;
  const paid_message = true;

  let lastFollowers = {};
  let intervalId = null;

  useEffect(() => {
    if (!settings && !isShowHi.current) return false;

    const init = async () => {
      try {
        if (!data.current.user_id) throw Object.assign(new Error("Не удалось получить user_id"), { code: "USER_ID_NOT_FOUND" });

        const jwt = await api.wasd.getJWTToken();
        const profileInfo = await api.wasd.getProfileInfo(data.current.user_id);

        if (intervalId) clearInterval(intervalId);
        startFetchMedia(profileInfo.user_profile.channel_id, data.current.settings, { profileInfo, jwt });

        console.log(`Попытка подключения: ${profileInfo.user_profile.user_login} (ID: ${profileInfo.user_profile.channel_id})`);

        socketRef.current = io("wss://chat.wasd.tv/", { transports: ["websocket"], query: { path: "/socket.io", EIO: 3 } });

        socketRef.current.on("connect_error", () => console.log(`Ошибка подключения.`));

        socketRef.current.on("connect", async () => {
          const streamId = await api.wasd.getStreamId(profileInfo.user_profile.channel_id);
          if (!streamId) return;
          console.log(`StreamID: ${streamId}`);

          if (!isShowHi.current) {
            const oldMessages = await api.wasd.getMessages(streamId, maxMessages);
            oldMessages.reverse().forEach((e) => {
              callback({ event: e.type, payload: { id: e.id, messageType: 'message', ...e.info } });
            });
          }

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
            if (event.event_type === "NEW_FOLLOWER" && follows && data.current.settings.follow_enabled) {
              if (lastFollowers[event.payload.user_login]) return;

              lastFollowers[event.payload.user_login] = 1;
              console.log("Последние добавления в избранное", lastFollowers);

              callback({ event: event.event_type, payload: event });
            }
          }, data.current.settings.alert_delay);
        });

        socketRef.current.on("subscribe", (event) => {
          setTimeout(() => {
            if (subscriptions && data.current.settings.sub_enabled) {
              callback({ event: "SUBSCRIBE", payload: event });
            }
          }, data.current.settings.alert_delay);
        });

        socketRef.current.on("paidMessage", (event) => {
          setTimeout(() => {
            if (paid_message && data.current.settings.paid_message_enabled) {
              callback({ event: "PAID_MESSAGE", payload: event });
            }
          }, data.current.settings.alert_delay);
        });

        socketRef.current.on("user_ban", (event) => {
          setTimeout(() => {
            callback({ event: "USER_BAN", payload: event });
          }, data.current.settings.alert_delay);
        });

        socketRef.current.on("message", (event) => {
          setTimeout(() => {
            callback({ event: "MESSAGE", payload: {...event, messageType: 'message'} });
          }, data.current.settings.message_show_delay);
        });

        socketRef.current.on("sticker", (event) => {
          setTimeout(() => {
            if (data.current.settings.show_sticker) {
              callback({ event: "STICKER", payload: {...event, messageType: 'message'} });
            }
          }, data.current.settings.message_show_delay);
        });

        socketRef.current.on("joined", (msg) => {
          isShowHi.current = true;
          console.log("Присоединился, роль:", msg.user_channel_role);
        });
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
  }, [settings]);

  const startFetchMedia = async (channel_id, _, info) => {
    const { profileInfo, jwt } = info;
    let lastStreamId = await api.wasd.getStreamId(profileInfo.user_profile.channel_id);

    const fetchMedia = async () => {
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
      } catch (e) {
        console.error(e);
      }
    };

    fetchMedia();
    intervalId = setInterval(() => fetchMedia(), 30000);
  };
};

export default WebSocket;
