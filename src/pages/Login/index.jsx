import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import ButtonLoading from "../../components/UI/Loading";

import api from "../../services/api/index.js";
import useAuth from "../../hooks/useAuth";
import useMeta from "../../hooks/useMeta/index.tsx";

import styles from "../modal.module.scss";
import "react-slideshow-image/dist/styles.css";

const Login = () => {
  useMeta({ title: "BetterWASYA | Авторизация" });
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showAuth, setShowAuth] = useState(false);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  const [token, setToken] = useState("undefined");

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      setIsLoadingLogin(true);
      const { data: loginData } = await api.auth.checkToken({ token: token });

      auth.setToken(loginData.token);
      auth.setUser(loginData.user);

      global.gtag("event", "signin_auth_token", { wasd_user_id: loginData.user.user_id, user_login: loginData.user.user_login });
    } catch (e) {
      if (e.message.match("404") || e.message.match("401")) {
        setError("Возможно, недействительный токен или ошибка с нашей стороны :(");
      } else {
        const redirect = searchParams.get("redirect");
        if (redirect) {
          navigate(redirect);
        } else {
          navigate("/");
        }
      }
    } finally {
      setIsLoading(false);
      setIsLoadingLogin(false);
    }
  };

  const inputChange = (e) => {
    setToken(e.target.value);
    setError(null);
  };

  return (
    <>
      <section className="main-section">
        <div className="block">
          <div className="main-title">Авторизация</div>
          <div className="descr">На данный момент мы можем вас авторизовать только через API токен.</div>
          <div className="buttons">
            <button className="button-big white" onClick={() => setShowAuth(true)}>
              Продолжить
            </button>
          </div>
        </div>
      </section>

      {showAuth && <modal-backdrop></modal-backdrop>}
      {showAuth && (
        <modal-window
          data-show="show"
          className={styles["show"]}
          onClick={(e) => {
            !isLoading && setShowAuth(!(e.target.dataset.show === "show" || e.target.className.match("hide")));
            setError(null);
          }}
        >
          <div className={styles["modal-block"] + " " + styles["modal-block_medium"]} style={{ width: "440px" }}>
            <div className={styles["modal-block__title"]}>
              <span> Авторизация </span>
            </div>

            <div className={styles["modal-block__content"]} style={{ padding: "0 24px" }}>
              <div className={styles.row}>
                <div className="col-36">
                  <label>Мы храним токен на вашем устройстве, не показывайте его третьему лицу!</label>
                  <br></br>
                  <br></br>
                  <label>
                    Где найти токен?
                    <a style={{ marginLeft: "5px" }} href="https://wasd.tv/general-settings/API" target="_blank" rel="noreferrer">
                      Токен API
                    </a>
                  </label>
                </div>
                <div className="col-64">
                  <wasd-input>
                    <div className="wasd-input-wrapper" style={{ flexDirection: "column", alignItems: "stretch" }}>
                      <div className="wasd-input">
                        <input
                          autoFocus
                          placeholder="Ваш токен"
                          type="text"
                          className={`blur ${isLoading ? "disabled" : ""}`}
                          onChange={inputChange}
                        ></input>
                      </div>
                      {error && (
                        <span className="error" style={{ marginTop: "5px" }}>
                          {error}
                        </span>
                      )}
                    </div>
                  </wasd-input>
                </div>
                <div className="col-36">
                  <br></br>
                  <label style={{ fontSize: "13px" }}>*Сгенерируйте новый токен а после чего вставьте в поле выше*</label>
                  <br></br>
                  <br></br>
                </div>
              </div>
            </div>

            <div className={styles["modal-block__footer"]}>
              <div className="flat-btn" style={{ display: "flex" }}>
                <button className={`medium basic hide ${isLoading ? "disabled" : ""}`} style={{ marginRight: "5px" }}>
                  отмена
                </button>
                <button
                  className={`primary medium updateUser ${isLoading ? "disabled" : ""}`}
                  disabled={isLoadingLogin}
                  style={{ width: "109px" }}
                  onClick={onSubmit}
                >
                  {isLoadingLogin ? <ButtonLoading /> : "проверить"}
                </button>
              </div>
            </div>
          </div>
        </modal-window>
      )}
    </>
  );
};

export default Login;
