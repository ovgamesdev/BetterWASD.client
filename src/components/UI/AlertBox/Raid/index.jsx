import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import reactStringReplace from "react-string-replace";

import "react-toastify/dist/ReactToastify.minimal.css";

import useAudio from "../../../../hooks/useAudio/index.tsx";
import "../text-animations.css";
import "../style.css";
import "../custom.css";

const Raid = (props) => {
  console.log(props);

  const {
    // raid_hide_animation,
    raid_image,
    raid_layout,
    raid_message_template,
    // raid_show_animation,
    raid_sound,
    raid_sound_volume,
    raid_text_animation,
    raid_text_delay,
    channel_name,
  } = props.info;

  const [playing, toggle, audio] = useAudio(raid_sound, raid_sound_volume);
  const [isShowText, setShowText] = useState(false);

  useEffect(() => {
    audio.play();

    setTimeout(() => setShowText(true), raid_text_delay);

    // setTimeout(() => {
    //   let speech = new SpeechSynthesisUtterance();
    //   speech.text = text;
    //   // speech.rate
    //   // speech.volume
    //   // speech.pitch
    //   window.speechSynthesis.speak(speech);
    // }, raid_text_delay);

    return () => {
      audio.pause();
    };
  }, []);

  const messageTemplate = reactStringReplace(
    raid_message_template,
    "{name}",
    () => (
      <span
        key={channel_name}
        data-token="name"
        style={{ color: "rgb(50, 95, 192)", position: "relative" }}
      >
        <span>
          {channel_name.split("").map((w, i) => (
            <span key={i} className={"animated-letter " + raid_text_animation}>
              {w}
            </span>
          ))}
        </span>
      </span>
    )
  );

  const userMessage = "";

  return (
    <div id="widget" className="widget-AlertBox" data-layout={raid_layout}>
      <div id="alert-box">
        <div id="particles"></div>
        <div id="wrap">
          <div id="alert-image-wrap">
            <div
              id="alert-image"
              style={{ backgroundImage: "url(" + raid_image + ")" }}
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

export default Raid;
