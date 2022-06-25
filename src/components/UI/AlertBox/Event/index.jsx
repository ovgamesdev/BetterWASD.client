import React, { useState, useEffect } from "react";
import reactStringReplace from "react-string-replace";

import "react-toastify/dist/ReactToastify.minimal.css";

import useAudio from "../../../../hooks/useAudio/index.tsx";
import "../text-animations.css";
import "../style.css";
import "../custom.css";

const Event = (props) => {
  // console.log(props.info);

  const {
    image,
    layout,
    message_template,
    sound,
    sound_volume,
    text_animation,
    text_delay,
    font,
    font_size,
    font_weight,
    font_color,
    font_color2,
    payload,
  } = props.info;

  // eslint-disable-next-line no-unused-vars
  const [playing, toggle, audio] = useAudio(sound, sound_volume);
  const [isShowText, setShowText] = useState(false);

  useEffect(() => {
    audio && audio.play();

    setTimeout(() => setShowText(true), text_delay);

    // setTimeout(() => {
    //   let speech = new SpeechSynthesisUtterance();
    //   speech.text = text;
    //   // speech.rate
    //   // speech.volume
    //   // speech.pitch
    //   window.speechSynthesis.speak(speech);
    // }, text_delay);

    return () => {
      audio && audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const messageTemplate = reactStringReplace(message_template, "{name}", () => (
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

  const userMessage = "";

  return (
    <div id="widget" className="widget-AlertBox" data-layout={layout}>
      <div id="alert-box">
        <div id="particles"></div>
        <div id="wrap">
          <div id="alert-image-wrap">
            <div id="alert-image" style={{ backgroundImage: "url(" + image + ")" }}></div>
          </div>

          <div id="alert-text-wrap" className={`${isShowText ? "animated fadeIn" : "hidden"}`}>
            <div id="alert-text">
              <div
                id="alert-message"
                style={{
                  fontSize: font_size,
                  color: font_color,
                  fontFamily: font.replace(/\+/g, " "),
                  fontWeight: font_weight,
                }}
              >
                {messageTemplate}
              </div>
              <div id="alert-user-message">{userMessage}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;
