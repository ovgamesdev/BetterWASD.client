import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ButtonLoading from "../../../components/UI/Loading";

import useAuth from "../../../hooks/useAuth";
import useMeta from "../../../hooks/useMeta/index.tsx";
import usePaddle from "../../../hooks/usePaddle/index.tsx";
import api from "../../../services/api/index.js";

import styles from "./pro.module.scss";
import "react-slideshow-image/dist/styles.css";

const DashboardPro = () => {
  useMeta({ title: "BetterWASYA | Pro" });

  const [isLoading, setIsLoading] = useState(true);
  // const [isShowGift, setIsShowGift] = useState(false);
  const [subData, setSubData] = useState({ is_active: false });
  // const [gift, setGift] = useState("");
  // const [errorGist, setErrorGift] = useState(null);

  const auth = useAuth();
  const navigate = useNavigate();

  const { paddle } = usePaddle({
    vendor: 0,
    environment: "",
    eventCallback: (data) => {
      // if (data.event === "Checkout.Loaded") setIsLoading(false);
      // if (data.event === "Checkout.Login") setIsLoading(false);
      // if (data.event === "Checkout.Location.Submit") setIsLoading(false);
      // if (data.event === "Checkout.Error") setIsLoading(false);
      // if (data.event === "Checkout.PaymentComplete") setIsLoading(false);
      // if (data.event === "Checkout.Complete")
      if (data.event === "Checkout.Close") {
        setTimeout(async () => {
          try {
            const { data } = await api.auth.getSubscribe();
            setSubData(data);
          } catch (e) {
            setSubData(e.response.data);
          }
          setIsLoading(false);
        }, 2000);
      }
      console.log("callback", data);
    },
  });

  const payViaPaddle = async () => {
    setIsLoading(true);
    const { data } = await api.auth.getSubscribeUrl();
    paddle.Checkout.open({ override: data.url });
  };

  const cancelSub = async () => {
    setIsLoading(true);
    paddle.Checkout.open({ override: subData.cancel_url });
  };

  const updateSub = async () => {
    setIsLoading(true);
    paddle.Checkout.open({ override: subData.update_url });
  };

  // const giftPayViaPaddle = async () => {
  //   setIsShowGift(true);
  // };

  // const giftGo = async () => {
  //   try {
  //     setIsLoading(true);
  //     const { data } = await api.auth.getGiftSubscribeUrl({
  //       user_login: gift,
  //     });

  //     setIsShowGift(false);
  //     paddle.Checkout.open({ override: data.url });
  //   } catch (e) {
  //     setErrorGift(e.response.data.error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };0

  // const giftHandler = async (e) => {
  //   setGift(e.target.value.trim());
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.auth.getSubscribe();
        setSubData(data);
      } catch (e) {
        setSubData(e.response.data);
      }
      setIsLoading(false);
    };
    if (typeof auth.editor?.user_id !== "undefined") return navigate("/dashboard/emotes");

    fetchData();
  }, [auth.editor?.user_id, navigate]);

  return (
    <div className="item block item_right" style={{ marginTop: "0px" }}>
      <div className="item__title"> BetterWASYA Pro </div>
      <div className="item__descr">
        Проще говоря, бесплатные услуги стоят денег. Пожалуйста, подумайте о поддержке BetterWASYA, подписавшись на BetterWASYA Pro. Мы
        также постараемся наградить вас в ответ какой-нибудь классной вещью:
        <div style={{ marginLeft: "15px" }}>
          <br /> • 5 персональных эмоций (эмоции, которые вы можете использовать везде на wasd.tv с помощью BetterWASYA)
          {/* <br /> • уникальный цвет имени пользователя */}
        </div>
      </div>
      <div className="item__border" />

      {subData && subData.cancellation_effective_date === null && <div className="item__title">Подписка уже оформлена</div>}

      <div className={styles.buttons + " item__descr"}>
        {subData && subData.cancellation_effective_date !== null && (
          <button
            className="button button-big blue"
            style={{ transition: "all .2s" }}
            disabled={isLoading || (subData && subData.cancellation_effective_date === null)}
            onClick={payViaPaddle}
          >
            {isLoading && <ButtonLoading style={{ marginRight: "10px" }} />}
            Подписаться
          </button>
        )}

        {subData && subData.cancellation_effective_date && (
          <span style={{ alignSelf: "center" }}>Отмененная подписка активна до {subData.cancellation_effective_date}</span>
        )}

        {subData && subData.cancellation_effective_date === null && (
          <button className="button button-big blue" onClick={updateSub} disabled={isLoading}>
            {isLoading && <ButtonLoading style={{ marginRight: "10px" }} />}
            Обновить
          </button>
        )}

        {subData && subData.cancellation_effective_date === null && (
          <button className="button button-big white" onClick={cancelSub} disabled={isLoading}>
            Отменить
          </button>
        )}

        {/* <button
              className="button button-big white"
              disabled={isLoading}
              onClick={giftPayViaPaddle}
              style={{
                transition: "all .2s",
                width: isLoading ? "180px" : "162px",
              }}
            >
              {isLoading && <ButtonLoading style={{ marginRight: "10px" }} />}
              Подарить
            </button> */}
      </div>
    </div>
  );
};

export default DashboardPro;
