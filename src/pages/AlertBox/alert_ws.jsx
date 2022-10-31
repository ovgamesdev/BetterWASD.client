import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const AlertWebSocket = async (callback = () => {}, token, settings) => {
  const socketRef = useRef(null);
  const settingsRef = useRef({});
  const intervalcheck = useRef(null);
  settingsRef.current = settings;

  const [searchParams] = useSearchParams();

  const follows = !!searchParams.get("follows");
  const subscriptions = !!searchParams.get("subscriptions");
  const resubs = !!searchParams.get("resubs");
  const paid_message = !!searchParams.get("paid_message");
  const raids = !!searchParams.get("raids");
  const bans = !!searchParams.get("bans");

  const isAll = !subscriptions && !resubs && !follows && !paid_message && !raids && !bans;

  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = new WebSocket(`${localStorage.debug === "true" ? "ws://localhost:5000" : "wss://betterwasd.herokuapp.com"}/alertbox/${token}`);
        socketRef.current.onopen = () => {
          intervalcheck.current = setInterval(() => {
            if (socketRef.current) {
              try {
                if (socketRef.current.readyState === socketRef.current.OPEN) socketRef.current.send("2");
              } catch (err) {
                console.log(err);
              }
            }
          }, 20000);
        };

        socketRef.current.onmessage = (e) => {
          const data = JSON.parse(e.data);

          setTimeout(() => {
            switch (data[0]) {
              case "NEW_FOLLOWER": {
                if ((isAll || follows) && settingsRef.current.follow_enabled) {
                  callback({ event: data[0], payload: { ...data[1], ...settingsRef.current } });
                }
                break;
              }
              case "SUBSCRIBE": {
                if ((isAll || subscriptions) && settingsRef.current.sub_enabled) {
                  callback({ event: data[0], payload: { ...data[1], ...settingsRef.current } });
                }
                break;
              }
              case "paidMessage": {
                if ((isAll || paid_message) && settingsRef.current.paid_message_enabled) {
                  if (settingsRef.current.paid_message_alert_min_amount !== 0 && settingsRef.current.paid_message_alert_min_amount < data[1].price_amount) return;
                  callback({ event: data[0], payload: { ...data[1], ...settingsRef.current } });
                }
                break;
              }
              case "RAID": {
                if ((isAll || raids) && settingsRef.current.raid_enabled) {
                  callback({ event: data[0], payload: { ...data[1], ...settingsRef.current } });
                }
                break;
              }
              case "BAN": {
                if ((isAll || bans) && settingsRef.current.ban_enabled) {
                  callback({ event: data[0], payload: { ...data[1], ...settingsRef.current } });
                }
                break;
              }
              case "UPDATE_SETTINGS": {
                settingsRef.current = data[1];
                callback({ event: data[0], payload: data[1] });
                break;
              }
              default: {
                break;
              }
            }
          }, settingsRef.current.alert_delay);
        };

        socketRef.current.onclose = () => {
          clearInterval(intervalcheck.current);
          intervalcheck.current = null;

          console.log(`Я попробую переподключиться через 10 секунд.`);
          setTimeout(() => init(), 1000 * 10);
        };

        this.socket.onerror = () => {
          clearInterval(intervalcheck.current);
          intervalcheck.current = null;

          console.log(`Я попробую переподключиться через 10 секунд.`);
          setTimeout(() => init(), 1000 * 10);
        };
      } catch (e) {
        // console.log(`Я попробую переподключиться через 10 секунд.`);
        // setTimeout(() => init(), 1000 * 10);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default AlertWebSocket;
