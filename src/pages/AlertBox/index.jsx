import React from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer, cssTransition } from "react-toastify";

import useTitle from "../../hooks/useTitle/index.tsx";
import useWebSocket from "./websocket";

import Event from "../../components/UI/AlertBox/Event";

import "./animate.css";
import { useState } from "react";
import useAlertWebSocket from "./alert_ws.jsx";
import api from "../../services/api";
import { useEffect } from "react";
import { useRef } from "react";

const AlertBox = () => {
  useTitle("BetterWASYA | AlertBox");
  const { token } = useParams();
  const [settings, setSettings] = useState(null);
  const [user, setUser] = useState(null);

  const activeToasts = useRef([]);

  const newEvent = async ({ event, payload }) => {
    if (event !== "UPDATE_SETTINGS" && payload.interrupt_mode && activeToasts.current.length === 1) {
      setTimeout(() => toast.dismiss(activeToasts.current[0]), payload.interrupt_mode_delay);
    }

    switch (event) {
      case "NEW_FOLLOWER": {
        const id = toast(
          <Event
            info={{
              image: payload.follow_image,
              layout: payload.follow_layout,
              message_template: payload.follow_message_template,
              sound: payload.follow_sound,
              sound_volume: payload.follow_sound_volume,
              text_animation: payload.follow_text_animation,
              text_delay: payload.follow_text_delay,
              // font
              font: payload.follow_font,
              font_size: payload.follow_font_size,
              font_weight: payload.follow_font_weight,
              font_color: payload.follow_font_color,
              font_color2: payload.follow_font_color2,
              // payload
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
            onOpen: () => {
              setTimeout(() => {
                if (payload.interrupt_mode && activeToasts.current.length >= 2) toast.dismiss(activeToasts.current[0]);
              }, payload.interrupt_mode_delay);
            },
            onClose: (e) => {
              activeToasts.current = activeToasts.current.filter((v) => v !== e.toastProps.toastId);
            },
          }
        );
        activeToasts.current.push(id);
        break;
      }
      case "SUBSCRIBE": {
        const id = toast(
          <Event
            info={{
              image: payload.sub_image,
              layout: payload.sub_layout,
              message_template: payload.sub_message_template,
              sound: payload.sub_sound,
              sound_volume: payload.sub_sound_volume,
              text_animation: payload.sub_text_animation,
              text_delay: payload.sub_text_delay,
              // font
              font: payload.sub_font,
              font_size: payload.sub_font_size,
              font_weight: payload.sub_font_weight,
              font_color: payload.sub_font_color,
              font_color2: payload.sub_font_color2,
              // payload
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
            onOpen: () => {
              setTimeout(() => {
                if (payload.interrupt_mode && activeToasts.current.length >= 2) toast.dismiss(activeToasts.current[0]);
              }, payload.interrupt_mode_delay);
            },
            onClose: (e) => {
              activeToasts.current = activeToasts.current.filter((v) => v !== e.toastProps.toastId);
            },
          }
        );
        activeToasts.current.push(id);
        break;
      }
      case "RAID": {
        const id = toast(
          <Event
            info={{
              image: payload.raid_image,
              layout: payload.raid_layout,
              message_template: payload.raid_message_template,
              sound: payload.raid_sound,
              sound_volume: payload.raid_sound_volume,
              text_animation: payload.raid_text_animation,
              text_delay: payload.raid_text_delay,
              // font
              font: payload.raid_font,
              font_size: payload.raid_font_size,
              font_weight: payload.raid_font_weight,
              font_color: payload.raid_font_color,
              font_color2: payload.raid_font_color2,
              // payload
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
            onOpen: () => {
              setTimeout(() => {
                if (payload.interrupt_mode && activeToasts.current.length >= 2) toast.dismiss(activeToasts.current[0]);
              }, payload.interrupt_mode_delay);
            },
            onClose: (e) => {
              activeToasts.current = activeToasts.current.filter((v) => v !== e.toastProps.toastId);
            },
          }
        );
        activeToasts.current.push(id);
        break;
      }
      case "UPDATE_SETTINGS":
        setSettings(payload);
        break;
      default:
        console.log("undefined event:", event);
        break;
    }
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { user_id, settings },
      } = await api.auth.getAlertSettingsByToken(token);
      setUser(user_id);
      setSettings(settings);
    };
    init();
  }, [token]);

  useEffect(() => {
    if (!settings) return;
    document.documentElement.style.setProperty("--alert-bg", settings.background_color);
  }, [settings]);

  useWebSocket(newEvent, user, settings);
  useAlertWebSocket(newEvent, token, settings);

  return (
    <>
      {settings && (
        <>
          <link
            href={`https://fonts.googleapis.com/css?family=${settings.follow_font.replace(/ /g, "+")}:300,400,600,700,800,900&effect=ice`}
            rel="stylesheet"
          />
          <link
            href={`https://fonts.googleapis.com/css?family=${settings.sub_font.replace(/ /g, "+")}:300,400,600,700,800,900&effect=ice`}
            rel="stylesheet"
          />
          <link
            href={`https://fonts.googleapis.com/css?family=${settings.raid_font.replace(/ /g, "+")}:300,400,600,700,800,900&effect=ice`}
            rel="stylesheet"
          />
        </>
      )}

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
    </>
  );
};

export default AlertBox;
