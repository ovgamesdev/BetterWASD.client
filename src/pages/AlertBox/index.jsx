import { useRef } from "react";
import { toast, ToastContainer, cssTransition } from "react-toastify";

import Event from "../../components/UI/AlertBox/Event";

import useWebSocket from "./websocket";
import useAlertWebSocket from "./alert_ws.jsx";
import useMeta from "../../hooks/useMeta/index.tsx";
import useAlertAuth from "../../hooks/useAlertAuth";

import "./animate.css";

const AlertBox = () => {
  useMeta({ title: "BetterWASYA | AlertBox" });
  const { settings, user, token, setSettings } = useAlertAuth();

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
              metadata: payload.follow_image_metadata,
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
              metadata: payload.sub_image_metadata,
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
              metadata: payload.raid_image_metadata,
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
      case "paidMessage": {
        const id = toast(
          <Event
            info={{
              image: payload.paid_message_image,
              metadata: payload.paid_message_image_metadata,
              layout: payload.paid_message_layout,
              message_template: payload.paid_message_message_template,
              sound: payload.paid_message_sound,
              sound_volume: payload.paid_message_sound_volume,
              text_animation: payload.paid_message_text_animation,
              text_delay: payload.paid_message_text_delay,
              // font
              font: payload.paid_message_font,
              font_size: payload.paid_message_font_size,
              font_weight: payload.paid_message_font_weight,
              font_color: payload.paid_message_font_color,
              font_color2: payload.paid_message_font_color2,

              // message
              alert_message_min_amount: payload.paid_message_alert_message_min_amount,
              // alert_min_amount: payload.paid_message_alert_min_amount,

              message_allow_emotes: payload.paid_message_message_allow_emotes,
              message_font: payload.paid_message_message_font,
              message_font_color: payload.paid_message_message_font_color,
              message_font_size: payload.paid_message_message_font_size,
              message_font_weight: payload.paid_message_message_font_weight,
              message_show: payload.paid_message_message_show,

              // tts
              tts_enabled: payload.paid_message_tts_enabled,
              tts_include_message_template: payload.paid_message_tts_include_message_template,
              tts_min_amount: payload.paid_message_tts_min_amount,
              tts_repetition_block_length: payload.paid_message_tts_repetition_block_length,
              tts_volume: payload.paid_message_tts_volume,

              // payload
              payload: {
                user_login: payload.sender_nickname,
                message: payload.message,
                price_amount: payload.price_amount,
                currency: payload.currency,
              },
            }}
          />,
          {
            autoClose: payload.paid_message_alert_duration,
            transition: cssTransition({
              enter: "animated " + payload.paid_message_show_animation,
              exit: "animated " + payload.paid_message_hide_animation,
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

  useWebSocket(newEvent, user, settings);
  useAlertWebSocket(newEvent, token, settings);

  return (
    <>
      {settings && (
        <div style={{ display: "none" }}>
          <link href={`https://fonts.googleapis.com/css?family=${settings.follow_font.replace(/ /g, "+")}:300,400,600,700,800,900`} rel="stylesheet" />
          <link href={`https://fonts.googleapis.com/css?family=${settings.sub_font.replace(/ /g, "+")}:300,400,600,700,800,900`} rel="stylesheet" />
          <link href={`https://fonts.googleapis.com/css?family=${settings.raid_font.replace(/ /g, "+")}:300,400,600,700,800,900`} rel="stylesheet" />

          {/* <img src={settings.follow_image} alt="follow-preload"></img>
          <img src={settings.sub_image} alt="follow-preload"></img>
          <img src={settings.raid_image} alt="follow-preload"></img> */}

          {settings.follow_image_metadata && settings.follow_image_metadata.mimeType && (
            <link rel="preload" as={settings.follow_image_metadata.mimeType.split("/")[0]} href={settings.follow_image_metadata.rawLink}></link>
          )}
          {settings.follow_sound_metadata && settings.follow_sound_metadata.mimeType && (
            <link rel="preload" as={settings.follow_sound_metadata.mimeType.split("/")[0]} href={settings.follow_sound_metadata.rawLink}></link>
          )}
          {settings.raid_image_metadata && settings.raid_image_metadata.mimeType && (
            <link rel="preload" as={settings.raid_image_metadata.mimeType.split("/")[0]} href={settings.raid_image_metadata.rawLink}></link>
          )}
          {settings.raid_sound_metadata && settings.raid_sound_metadata.mimeType && (
            <link rel="preload" as={settings.raid_sound_metadata.mimeType.split("/")[0]} href={settings.raid_sound_metadata.rawLink}></link>
          )}
          {settings.sub_image_metadata && settings.sub_image_metadata.mimeType && (
            <link rel="preload" as={settings.sub_image_metadata.mimeType.split("/")[0]} href={settings.sub_image_metadata.rawLink}></link>
          )}
          {settings.sub_sound_metadata && settings.sub_sound_metadata.mimeType && (
            <link rel="preload" as={settings.sub_sound_metadata.mimeType.split("/")[0]} href={settings.sub_sound_metadata.rawLink}></link>
          )}
        </div>
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
