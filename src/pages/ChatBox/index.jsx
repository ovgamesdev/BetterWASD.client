import { useState } from "react";
import useChatAuth from "../../hooks/useChatAuth";
import useMeta from "../../hooks/useMeta/index.tsx";

import Chat from "../../components/UI/Chat";

import useWebSocket from "./websocket";
import "../AlertBox/animate.css";

const maxMessages = 29;

const ChatBox = () => {
  useMeta({ title: "BetterWASYA | ChatBox" });
  const { settings, user, token, setSettings, emotes, personalEmotes, subBadges, paints } = useChatAuth();
  const [messages, setMessages] = useState([]);

  const newEvent = (e) => {
    switch (e.event) {
      case "MESSAGE":
      case "STICKER": {
        setMessages((msgs = []) => {
          if (msgs.length + 1 > maxMessages) msgs.splice(0, 1);
          return [...msgs, e.payload];
        });
        break;
      }
      case "USER_BAN": {
        if (e.payload.payload.keep_messages) return;
        setMessages((msgs = []) => msgs.filter((msg) => e.payload.payload.user_id !== msg.user_id));
        break;
      }
      case "MESSAGE_DELETED": {
        setMessages((msgs = []) => msgs.filter((msg) => (e.payload.ids.length === 0 ? e.payload.userId !== msg.user_id : !e.payload.ids.includes(msg.id))));
        break;
      }
      case "PAID_MESSAGE": {
        break;
      }
    }
  };

  useWebSocket(newEvent, user, settings, { maxMessages });

  return settings && <Chat style={{ height: "100%", width: "100%" }} messages={messages} streamer_id={user} settings={settings} emotes={emotes} personalEmotes={personalEmotes} subBadges={subBadges} paints={paints} />;
};

export default ChatBox;
