import { useState, useEffect, useCallback } from "react";
import reactStringReplace from "react-string-replace";

import { HOSTURL } from "../../../../services/api/axios";
import { decode } from "../../../../lib/code-mnem";
import useAudio from "../../../../hooks/useAudio/index.tsx";
import useAlertAuth from "../../../../hooks/useAlertAuth";

import "react-toastify/dist/ReactToastify.minimal.css";
import "../text-animations.css";
import "../style.css";
import "../custom.css";

const clearTTSMessage = (max, message) => {
  if (max === 0) return message;

  const reg = "(.)\\1{".concat(max, ",}");
  const reg2 = new RegExp(reg, "gim");
  return message
    .replace(reg2, "")
    .replace(/\s{2,}/gim, " ")
    .trim();
};
export const replaceEmotes = (text = "", emotes = {}, personalEmotes = {}, user_id = 0) => {
  let newText = [];
  for (let word of text.split(" ")) {
    const emote = (personalEmotes[user_id] && personalEmotes[user_id][word]) || emotes[word];
    if (emote) {
      word = `<img class="chat-emoji" style="width: calc(${(emote.width.x1 / emote.height.x1).toFixed(3)} * 1.5em);" alt="${word}" src="${emote?.url[`x1`]}" srcset="${emote?.url[`x2`]}" />`;
    }
    newText.push(word);
  }
  return newText.join(" ");
};

const Event = (props) => {
  const { emotes, personalEmotes } = useAlertAuth();

  const { image, metadata, layout, message_template, sound, sound_volume, text_animation, text_delay, font, font_size, font_weight, font_color, font_color2, payload } = props.info;
  const { alert_message_min_amount, message_allow_emotes, message_font, message_font_color, message_font_size, message_font_weight, message_show } = props.info;
  const { tts_enabled, tts_include_message_template, tts_min_amount, tts_repetition_block_length, tts_volume } = props.info;

  // eslint-disable-next-line no-unused-vars
  const [_, __, audio] = useAudio(sound, sound_volume);
  const [isShowText, setShowText] = useState(false);

  const vid = useCallback(
    (x) => {
      if (x) x.volume = sound_volume / 100;
    },
    [sound_volume]
  );

  useEffect(() => {
    if (audio) {
      audio.play();

      audio.onerror = (e) => {
        console.log("err", e);
        startTTS();
      };
      audio.onended = (e) => {
        console.log("end", e);
        startTTS();
      };
    }

    if (!audio) startTTS();

    setTimeout(() => setShowText(true), text_delay);

    return () => audio && audio.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTTS = async () => {
    if (!tts_enabled) return;
    if (tts_min_amount !== 0 && tts_min_amount < payload.price_amount) return;

    let message = `${tts_include_message_template ? message_template.replace("{name}", payload.user_login).replace("{amount}", `${payload.price_amount} ${payload.currency}`) + ". " : ""}${
      payload.message
    }`
      .replace(/((?:https?|ftp):\/\/[\n\S]+)|(<([^>]+)>)+/gi, "")
      .trim();
    message = clearTTSMessage(tts_repetition_block_length, message);

    const tts = new Audio(`${HOSTURL}/api/v1/polly/speak?voice=Tatyana&text=${message}`);
    tts.volume = tts_volume / 100;
    tts.play();
  };

  let messageTemplate = reactStringReplace(message_template, "{name}", () => (
    <span key={payload.user_login} data-token="name" style={{ color: font_color2, position: "relative" }}>
      <span>
        {payload.user_login.split("").map((w, i) => (
          <span key={i} className={"animated-letter " + text_animation}>
            {w}
          </span>
        ))}
      </span>
    </span>
  ));

  if (payload.price_amount || payload.currency) {
    messageTemplate = reactStringReplace(messageTemplate, "{amount}", () => (
      <span key={`${payload.price_amount} ${payload.currency}`} data-token="amount" style={{ color: font_color2, position: "relative" }}>
        <span>
          {`${payload.price_amount} ${payload.currency}`.split("").map((w, i) => (
            <span key={i} className={"animated-letter " + text_animation}>
              {w.match(/\s/) ? <>&nbsp;</> : w}
            </span>
          ))}
        </span>
      </span>
    ));
  }

  const isVideo = metadata && metadata.mimeType && metadata.mimeType.includes("video");

  return (
    <div id="widget" className="widget-AlertBox" data-layout={layout}>
      <div id="alert-box">
        {/* <div id="particles" /> */}
        <div id="wrap">
          <div id="alert-image-wrap">
            <div id="alert-image" style={{ backgroundImage: isVideo ? "none" : "url(" + image + ")" }}>
              {isVideo && <video ref={vid} id="alert-image" autoPlay controls={false} loop src={image}></video>}
            </div>
          </div>

          <div id="alert-text-wrap" className={`${isShowText ? "animated fadeIn" : "hidden"}`}>
            <div id="alert-text">
              <div
                id="alert-message"
                style={{
                  fontSize: font_size,
                  color: font_color,
                  fontFamily: font?.replace(/\+/g, " "),
                  fontWeight: font_weight,
                }}
              >
                {messageTemplate}
              </div>
              {message_show && (alert_message_min_amount === 0 || alert_message_min_amount > payload.price_amount - 1) && (
                <div
                  id="alert-user-message"
                  style={{
                    fontSize: message_font_size,
                    color: message_font_color,
                    fontFamily: message_font?.replace(/\+/g, " "),
                    fontWeight: message_font_weight,
                  }}
                  dangerouslySetInnerHTML={{ __html: message_allow_emotes ? replaceEmotes(payload.message, emotes, personalEmotes, payload.user_id) : payload.message }}
                ></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;
