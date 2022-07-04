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
  const raids = !!searchParams.get("raids");

  const isAll = !subscriptions && !resubs && !follows && !raids;

  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = new WebSocket(
          `${localStorage.debug === "true" ? "ws://localhost:5000" : "wss://betterwasd.herokuapp.com"}/alertbox/${token}`
        );
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
                if (isAll || follows) {
                  callback({ event: data[0], payload: { ...data[1], ...settingsRef.current } });
                }
                break;
              }
              case "SUBSCRIBE": {
                if (isAll || subscriptions) {
                  callback({ event: data[0], payload: { ...data[1], ...settingsRef.current } });
                }
                break;
              }
              case "RAID": {
                if (isAll || raids) {
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
