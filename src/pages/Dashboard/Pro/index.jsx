import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-slideshow-image/dist/styles.css";
import ButtonLoading from "../../../components/UI/Loading";
import useAuth from "../../../hooks/useAuth";
import usePaddle from "../../../hooks/usePaddle/index.tsx";
import useTitle from "../../../hooks/useTitle";
import api from "../../../services/api";

import styles from "./pro.module.scss";

const DashboardPro = () => {
  useTitle("BetterWASYA | Pro");

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
    if (typeof auth.editor?.user_id !== "undefined")
      return navigate("/dashboard/emotes");

    fetchData();
  }, [auth.editor?.user_id, navigate]);

  return (
    <div className="item block item_right" style={{ marginTop: "0px" }}>
      <div className="item__title"> BetterWASYA Pro </div>
      <div className="item__descr">
        Проще говоря, бесплатные услуги стоят денег. Пожалуйста, подумайте о
        поддержке BetterWASYA, подписавшись на BetterWASYA Pro. Мы также
        постараемся наградить вас в ответ какой-нибудь классной вещью:
        <div style={{ marginLeft: "15px" }}>
          <br /> • 5 персональных эмоций (эмоции, которые вы можете использовать
          везде на wasd.tv с помощью BetterWASYA)
          {/* <br /> • уникальный цвет имени пользователя */}
        </div>
      </div>
      <div className="item__border"></div>

      {subData && subData.cancellation_effective_date === null && (
        <div className="item__title">Подписка уже оформлена</div>
      )}

      <div className={styles.buttons + " item__descr"}>
        {subData && subData.cancellation_effective_date !== null && (
          <button
            className="button button-big blue"
            style={{ transition: "all .2s" }}
            disabled={
              isLoading ||
              (subData && subData.cancellation_effective_date === null)
            }
            onClick={payViaPaddle}
          >
            {isLoading && <ButtonLoading style={{ marginRight: "10px" }} />}
            Подписаться
          </button>
        )}

        {subData && subData.cancellation_effective_date && (
          <span style={{ alignSelf: "center" }}>
            Отмененная подписка активна до {subData.cancellation_effective_date}
          </span>
        )}

        {subData && subData.cancellation_effective_date === null && (
          <button
            className="button button-big blue"
            onClick={updateSub}
            disabled={isLoading}
          >
            {isLoading && <ButtonLoading style={{ marginRight: "10px" }} />}
            Обновить
          </button>
        )}

        {subData && subData.cancellation_effective_date === null && (
          <button
            className="button button-big white"
            onClick={cancelSub}
            disabled={isLoading}
          >
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

      {/* <div style={{ margin: "40px 0 0 0" }}>
        <div
          style={{
            display: "flex",
            borderTop: "1px solid white",
            paddingTop: "15px",
          }}
        >
          <div style={{ marginRight: "auto" }}>
            <h4 style={{ marginBottom: "5px" }}>
              Приобретайте новые уникальные краски для своего имени пользователя
              в чате WASD.tv.
            </h4>
            <p style={{ margin: "0" }}>
              Доступные в настоящее время краски:
              <br />
              Видимый для пользователей Chrome с расширением BetetrWASD
            </p>
            <br />
          </div>
          <div
            style={{
              height: "50px",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {auth.user.user_login}
          </div>
        </div>
        <br />
        <div
          style={{
            display: "flex",
            borderTop: "1px solid white",
            paddingTop: "15px",
          }}
        >
          <div style={{ marginRight: "auto" }}>
            <h4 style={{ marginBottom: "5px" }}> Значок подписчика</h4>
            <p style={{ margin: "0" }}>
              Получите глобальный значок чата подписчиков, который будет
              меняться со временем.
            </p>
          </div>
          <div
            style={{ width: "50px", height: "50px", background: "red" }}
          ></div>
        </div>
        <br />
        <div
          style={{
            display: "flex",
            borderTop: "1px solid white",
            paddingTop: "15px",
          }}
        >
          <div style={{ marginRight: "auto" }}>
            <h4 style={{ marginBottom: "5px" }}>
              Анимированное изображение профиля
            </h4>
            <p style={{ margin: "0" }}>
              Выделитесь с помощью индивидуальной картинки профиля с анимацией
              на сайте WASD.tv
            </p>
          </div>
          <div
            style={{ width: "50px", height: "50px", background: "red" }}
          ></div>
        </div>
        <br />
        <div
          style={{
            display: "flex",
            borderTop: "1px solid white",
            paddingTop: "15px",
          }}
        >
          <div style={{ marginRight: "auto" }}>
            <h4 style={{ marginBottom: "5px" }}> Персональные эмоции</h4>
            <p style={{ margin: "0" }}>
              У подписчиков есть 5 слотов для эмоций, которые можно использовать
              на всех каналах.
            </p>
          </div>
          <div
            style={{ width: "50px", height: "50px", background: "red" }}
          ></div>
        </div>
      </div> */}
      {/* {isShowGift && <ovg-modal-backdrop></ovg-modal-backdrop>}
      {isShowGift && (
        <ovg-modal-window
          data-show="show"
          className={styles["show"]}
          onClick={(e) => {
            !isLoading &&
              setIsShowGift(
                !(
                  e.target.dataset.show === "show" ||
                  e.target.className.match("hide")
                )
              );
            setErrorGift(null);
          }}
        >
          <div
            className={
              styles["modal-block"] + " " + styles["modal-block_medium"]
            }
            style={{ width: "440px" }}
          >
            <div className={styles["modal-block__title"]}>
              <span>Выберите получателя</span>
            </div>

            <div
              className={styles["modal-block__content"]}
              style={{ padding: "0 24px" }}
            >
              <div className={styles.row}>
                {/* <div className="col-36">
                  <span style={{ color: "rgb(255,255,255)", fontSize: "16px" }}>

                  </span>
                </div> */}
      {/* <div className="col-64">
                  <wasd-input>
                    <div
                      ovg=""
                      className="wasd-input-wrapper"
                      style={{ flexDirection: "column", alignItems: "stretch" }}
                    >
                      <div ovg="" className={`wasd-input`}>
                        <input
                          ovg=""
                          type="text"
                          placeholder="Имя пользователя"
                          value={gift}
                          className={isLoading ? "disabled" : ""}
                          onChange={(e) => giftHandler(e)}
                        ></input>
                      </div>

                      {errorGist && (
                        <span className="error" style={{ marginTop: "5px" }}>
                          {errorGist}
                        </span>
                      )}
                    </div>
                  </wasd-input> */}
      {/* <p
                    style={{
                      paddingTop: "5px",
                      color: "var(--wasd-color-text-third)",
                    }}
                  >
                    Коды эмоций могут быть буквами и цифрами. Не менее 3
                    символов.
                  </p> */}
      {/* </div>
              </div>
            </div>

            <div className={styles["modal-block__footer"]}>
              <div className="flat-btn ovg" style={{ display: "flex" }}>
                <button
                  className="medium ovg basic hide"
                  style={{ marginRight: "5px" }}
                >
                  отмена
                </button>
                <button
                  disabled={isLoading}
                  style={{ width: "141.2px" }}
                  className="primary medium ovg"
                  onClick={() => giftGo()}
                >
                  {isLoading ? <ButtonLoading /> : "подарить"}
                </button>
              </div>
            </div>
          </div>
        </ovg-modal-window> 
       )} */}
    </div>
  );
};

export default DashboardPro;
