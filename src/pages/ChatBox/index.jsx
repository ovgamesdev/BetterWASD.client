import { useState } from "react";
import useChatAuth from "../../hooks/useChatAuth";
import useMeta from "../../hooks/useMeta/index.tsx";

import Chat from "../../components/UI/Chat";

import useWebSocket from "./websocket";
import "../AlertBox/animate.css";

const maxMessages = 29;

const ChatBox = () => {
  useMeta({ title: "BetterWASYA | ChatBox" });
  const { settings, user, token, setSettings, emotes, subBadges, paints } = useChatAuth();
  const [messages, setMessages] = useState([]);

  const newEvent = (e) => {
    switch (e.event) {
      case "MESSAGE":
      case "STICKER": {
        // !(settings?.hide_commands && e.payload?.message?.slice(0, 1) === "!")

        if (true) {
          setMessages((msgs = []) => {
            if (msgs.length + 1 > maxMessages) msgs.splice(0, 1);
            return [...msgs, e.payload];
          });
        }
        break;
      }
      case "USER_BAN": {
        break;
      }
      case "PAID_MESSAGE": {
        break;
      }
    }
  };

  useWebSocket(newEvent, user, settings, { maxMessages });

  return settings && <Chat style={{ height: "100%", width: "100%" }} messages={messages} streamer_id={user} settings={settings} emotes={emotes} subBadges={subBadges} paints={paints} />;
};

export default ChatBox;
