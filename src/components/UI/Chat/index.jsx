import { v4 as uuidv4 } from "uuid";

import Message from "./Message/imdex";
import SystemMessage from "./SystemMessage";

import "./message.scss";

import "./index.scss";
import "./themes.scss";
import "./paints.css";

import "./font/index.css";

const Chat = ({ messages, style, settings, emotes, personalEmotes, subBadges, paints }) => {
  console.log("messages", messages);

  const includeProfanityWords = (msg) => (typeof msg === "string" ? !settings.profanity_custom_words.every((word) => !msg.split(" ").includes(word)) : false);

  return (
    <>
      <link rel="stylesheet" href="https://static.wasd.tv/icons/css/wasd-font.css" />

      <div className="body-container" style={style}>
        <div className="block-wrapper">
          <div className="block">
            <div className={`block__messages ${settings.theme}`} style={{ color: settings.text_color, fontSize: settings.text_size }}>
              {typeof messages === "object" &&
                messages.length > 0 &&
                messages.map((d) =>
                  d.messageType === "message" ? (
                    (!settings.show_sticker && d.sticker) ||
                    (settings.hide_commands && d.message?.slice(0, 1) === "!") ||
                    settings.muted_chatters.includes(d.user_login.toLowerCase()) ||
                    includeProfanityWords(d.message) ? null : (
                      <Message data={d} settings={settings} key={d?.id} emotes={emotes} personalEmotes={personalEmotes} subBadges={subBadges} paints={paints} />
                    )
                  ) : d.messageType === "system_message" ? (
                    <SystemMessage data={d} settings={settings} key={uuidv4()} />
                  ) : undefined
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
