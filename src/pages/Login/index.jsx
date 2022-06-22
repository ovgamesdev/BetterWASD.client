import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ButtonLoading from "../../components/UI/Loading";
import "react-slideshow-image/dist/styles.css";
import classnames from "classnames";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";

import styles from "../modal.module.scss";

const Login = () => {
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

      {showAuth && <ovg-modal-backdrop></ovg-modal-backdrop>}
      {showAuth && (
        <ovg-modal-window
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
                    <div ovg="" className="wasd-input-wrapper" style={{ flexDirection: "column", alignItems: "stretch" }}>
                      <div ovg="" className="wasd-input">
                        <input
                          ovg=""
                          autoFocus
                          placeholder="Ваш токен"
                          type="text"
                          className={classnames("blur", isLoading && "disabled")}
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
              <div className="flat-btn ovg" style={{ display: "flex" }}>
                <button className={classnames("medium", "ovg", "basic", "hide", isLoading && "disabled")} style={{ marginRight: "5px" }}>
                  отмена
                </button>
                <button
                  className={classnames("primary", "medium", "ovg", "updateUser", isLoading && "disabled")}
                  disabled={isLoadingLogin}
                  style={{ width: "109px" }}
                  onClick={onSubmit}
                >
                  {isLoadingLogin ? <ButtonLoading /> : "проверить"}
                </button>
              </div>
            </div>
          </div>
        </ovg-modal-window>
      )}
    </>
  );
};

export default Login;
