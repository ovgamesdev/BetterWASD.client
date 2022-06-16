import React from "react";

import { useParams } from "react-router-dom";

import Follow from "../../components/UI/AlertBox/Follow";
import useTitle from "../../hooks/useTitle/index.tsx";
import useWebSocket from "./websocket";

import { toast, ToastContainer } from "react-toastify";

const AlertBox = () => {
  useTitle("BetterWASD | AlertBox");
  const { token } = useParams();

  const newEvent = async ({ event, payload }) => {
    toast(<Follow info={payload} />, {
      autoClose: payload.follow_alert_duration,
    });

    console.log(payload);
  };

  useWebSocket(token, newEvent);

  return (
    <>
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
