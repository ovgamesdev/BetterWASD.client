import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-slideshow-image/dist/styles.css";
// import ButtonLoading from "../components/UI/Loading";
import useAuth from "../hooks/useAuth";
// import api from "../services/api";

const Subscription = () => {
  // const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  // const payViaXsolla = async () => {
  //   setIsLoading(true);
  //   const { data } = await api.xsolla.getToken();

  //   // console.log(data);
  //   // if (data.status === "success") window.location.replace(data.link);

  //   window.location.replace(
  //     "https://sandbox-secure.xsolla.com/paystation3/?access_token=" +
  //       data.token
  //   );
  // };

  useEffect(() => {
    if (typeof auth.editor?.user_id !== "undefined") return navigate("/");
  }, [auth.editor?.user_id, navigate]);

  return (
    <section className="main-section">
      <div className="block">
        <div className="main-title">Платная подписка на BetterWASD</div>
        <div className="descr">
          Получите крутые косметические преимущества, дополнительные функции и
          поддержите приложение.
          {/* Получите что-то? */}
        </div>
        <div className="buttons">
          {
            <button
              className="button button-big blue"
              style={{
                transition: "all .2s",
                pointerEvents: "none",
                // width: isLoading ? "220px" : "202px",
                width: "202px",
              }}
            >
              SOON
            </button>
          }
          {/* <button
            className="button button-big blue"
            style={{
              transition: "all .2s",
              width: isLoading ? "220px" : "202px",
            }}
            disabled={isLoading}
            onClick={payViaXsolla}
          >
            {isLoading && <ButtonLoading style={{ marginRight: "10px" }} />}
            Подписаться
          </button>

          <button className="button-big white" disabled={true}>
            Подарить
          </button> */}
        </div>
      </div>

      {/* <div className="slideshow-container" style={{ top: "-10%" }}>
          <h3>Лучшие дарители</h3>
          <div style={{ marginLeft: "5px" }}>
            <div
              style={{
                display: "flex",
                margin: "5px 5px 5px 0",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,.25)",
                padding: "8px",
                width: "280px",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: "rgb(255, 170, 0)",
                }}
              ></div>
              <div style={{ marginLeft: "5px" }}>undefined</div>
            </div>
            <div
              style={{
                display: "flex",
                margin: "5px 5px 5px 20px",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,.25)",
                padding: "8px",
                width: "280px",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: "rgb(192, 192, 192)",
                }}
              ></div>
              <div style={{ marginLeft: "5px" }}>undefined</div>
            </div>
            <div
              style={{
                display: "flex",
                margin: "5px 5px 5px 40px",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,.25)",
                padding: "8px",
                width: "280px",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: "rgb(205, 127, 50)",
                }}
              ></div>
              <div style={{ marginLeft: "5px" }}>undefined</div>
            </div>
          </div>
        </div> */}

      <div style={{ margin: "40px 0 0 0" }}>
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
      </div>
    </section>
  );
};

export default Subscription;
