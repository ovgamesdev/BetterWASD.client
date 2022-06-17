import React from "react";

import { useParams } from "react-router-dom";

import Follow from "../../components/UI/AlertBox/Follow";
import useTitle from "../../hooks/useTitle/index.tsx";
import useWebSocket from "./websocket";

import { toast, ToastContainer } from "react-toastify";
import Sub from "../../components/UI/AlertBox/Sub";
import Raid from "../../components/UI/AlertBox/Raid";

const AlertBox = () => {
  useTitle("BetterWASD | AlertBox");
  const { token } = useParams();

  const newEvent = async ({ event, payload }) => {
    switch (event) {
      case "NEW_FOLLOWER":
        toast(<Follow info={payload} />, {
          autoClose: payload.follow_alert_duration,
        });
        break;
      case "SUBSCRIBE":
        toast(<Sub info={payload} />, {
          autoClose: payload.sub_alert_duration,
        });
        break;
      case "RAID":
        toast(<Raid info={payload} />, {
          autoClose: payload.raid_alert_duration,
        });
        break;
      default:
        console.log("undefined event:", event);
        break;
    }

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
