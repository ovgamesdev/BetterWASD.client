import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import reactStringReplace from "react-string-replace";

import "react-toastify/dist/ReactToastify.minimal.css";

import useAudio from "../../../../hooks/useAudio/index.tsx";
import "../text-animations.css";
import "../style.css";
import "../custom.css";

const Sub = (props) => {
  console.log(props);

  const {
    // sub_hide_animation,
    sub_image,
    sub_layout,
    sub_message_template,
    // sub_show_animation,
    sub_sound,
    sub_sound_volume,
    sub_text_animation,
    sub_text_delay,
    user_login,
  } = props.info;

  const [playing, toggle, audio] = useAudio(sub_sound, sub_sound_volume);
  const [isShowText, setShowText] = useState(false);

  useEffect(() => {
    audio.play();

    setTimeout(() => setShowText(true), sub_text_delay);

    // setTimeout(() => {
    //   let speech = new SpeechSynthesisUtterance();
    //   speech.text = text;
    //   // speech.rate
    //   // speech.volume
    //   // speech.pitch
    //   window.speechSynthesis.speak(speech);
    // }, sub_text_delay);

    return () => {
      audio.pause();
    };
  }, []);

  const messageTemplate = reactStringReplace(
    sub_message_template,
    "{name}",
    () => (
      <span
        key={user_login}
        data-token="name"
        style={{ color: "rgb(50, 95, 192)", position: "relative" }}
      >
        <span>
          {user_login.split("").map((w, i) => (
            <span key={i} className={"animated-letter " + sub_text_animation}>
              {w}
            </span>
          ))}
        </span>
      </span>
    )
  );

  const userMessage = "";

  return (
    <div id="widget" className="widget-AlertBox" data-layout={sub_layout}>
      <div id="alert-box">
        <div id="particles"></div>
        <div id="wrap">
          <div id="alert-image-wrap">
            <div
              id="alert-image"
              style={{ backgroundImage: "url(" + sub_image + ")" }}
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

export default Sub;
