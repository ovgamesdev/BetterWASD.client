import React from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer, cssTransition } from "react-toastify";

import useTitle from "../../hooks/useTitle/index.tsx";
import useWebSocket from "./websocket";

import Event from "../../components/UI/AlertBox/Event";

import "./animate.css";

const AlertBox = () => {
  useTitle("BetterWASYA | AlertBox");
  const { token } = useParams();

  const newEvent = async ({ event, payload }) => {
    switch (event) {
      case "NEW_FOLLOWER":
        toast(
          <Event
            info={{
              image: payload.follow_image,
              layout: payload.follow_layout,
              message_template: payload.follow_message_template,
              sound: payload.follow_sound,
              sound_volume: payload.follow_sound_volume,
              text_animation: payload.follow_text_animation,
              text_delay: payload.follow_text_delay,
              payload: {
                user_login: payload.payload.user_login,
              },
            }}
          />,
          {
            autoClose: payload.follow_alert_duration,
            transition: cssTransition({
              enter: "animated " + payload.follow_show_animation,
              exit: "animated " + payload.follow_hide_animation,
            }),
          }
        );
        break;
      case "SUBSCRIBE":
        toast(
          <Event
            info={{
              image: payload.sub_image,
              layout: payload.sub_layout,
              message_template: payload.sub_message_template,
              sound: payload.sub_sound,
              sound_volume: payload.sub_sound_volume,
              text_animation: payload.sub_text_animation,
              text_delay: payload.sub_text_delay,
              payload: {
                user_login: payload.user_login,
              },
            }}
          />,
          {
            autoClose: payload.sub_alert_duration,
            transition: cssTransition({
              enter: "animated " + payload.sub_show_animation,
              exit: "animated " + payload.sub_hide_animation,
            }),
          }
        );
        break;
      case "RAID":
        toast(
          <Event
            info={{
              image: payload.raid_image,
              layout: payload.raid_layout,
              message_template: payload.raid_message_template,
              sound: payload.raid_sound,
              sound_volume: payload.raid_sound_volume,
              text_animation: payload.raid_text_animation,
              text_delay: payload.raid_text_delay,
              payload: {
                user_login: payload.channel_name,
              },
            }}
          />,
          {
            autoClose: payload.raid_alert_duration,
            transition: cssTransition({
              enter: "animated " + payload.raid_show_animation,
              exit: "animated " + payload.raid_hide_animation,
            }),
          }
        );
        break;
      default:
        console.log("undefined event:", event);
        break;
    }

    console.log(payload);
  };

  useWebSocket(token, newEvent);

  return (
    <ToastContainer
      style={{}}
      // hideProgressBar={true}
      closeOnClick={false}
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      closeButton={false}
      rtl={false}
      draggable={false}
      limit={1}
    />
  );
};

export default AlertBox;
