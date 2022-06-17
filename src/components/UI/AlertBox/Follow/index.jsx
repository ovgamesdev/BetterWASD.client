import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import reactStringReplace from "react-string-replace";

import "react-toastify/dist/ReactToastify.minimal.css";

import useAudio from "../../../../hooks/useAudio/index.tsx";
import "../text-animations.css";
import "../style.css";
import "../custom.css";

const Follow = (props) => {
  console.log(props);

  const {
    // follow_hide_animation,
    follow_image,
    follow_layout,
    follow_message_template,
    // follow_show_animation,
    follow_sound,
    follow_sound_volume,
    follow_text_animation,
    follow_text_delay,
    payload,
  } = props.info;

  // eslint-disable-next-line no-unused-vars
  const [playing, toggle, audio] = useAudio(follow_sound, follow_sound_volume);
  const [isShowText, setShowText] = useState(false);

  useEffect(() => {
    audio.play();

    setTimeout(() => setShowText(true), follow_text_delay);

    // setTimeout(() => {
    //   let speech = new SpeechSynthesisUtterance();
    //   speech.text = text;
    //   // speech.rate
    //   // speech.volume
    //   // speech.pitch
    //   window.speechSynthesis.speak(speech);
    // }, follow_text_delay);

    return () => {
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const messageTemplate = reactStringReplace(
    follow_message_template,
    "{name}",
    () => (
      <span
        key={payload.user_login}
        data-token="name"
        style={{ color: "rgb(50, 95, 192)", position: "relative" }}
      >
        <span>
          {payload.user_login.split("").map((w, i) => (
            <span
              key={i}
              className={"animated-letter " + follow_text_animation}
            >
              {w}
            </span>
          ))}
        </span>
      </span>
    )
  );

  const userMessage = "";

  return (
    <div id="widget" className="widget-AlertBox" data-layout={follow_layout}>
      <div id="alert-box">
        <div id="particles"></div>
        <div id="wrap">
          <div id="alert-image-wrap">
            <div
              id="alert-image"
              style={{ backgroundImage: "url(" + follow_image + ")" }}
            ></div>
          </div>

          <div id="alert-text-wrap" className={isShowText ? "" : "hidden"}>
            <div id="alert-text">
              <div
                id="alert-message"
                style={{
                  fontSize: "64px",
                  color: "rgb(255,255,255)",
                  fontFamily: "Open Sans",
                  fontWeight: "800",
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

export default Follow;
