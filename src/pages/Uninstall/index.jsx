import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ButtonLoading from "../../components/UI/Loading";

import api from "../../services/api/index.js";
import useMeta from "../../hooks/useMeta/index.tsx";

import "./faq-tabs.scss";
import "./index.scss";
import "./question.scss";
import "react-slideshow-image/dist/styles.css";

const Uninstall = () => {
  useMeta({ title: "BetterWASYA | Обратная связь" });

  const { user_id } = useParams();

  const [activeTab, setActiveTab] = useState("");
  const [placeholderData, setPlaceholderData] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);
  const [isError, setIsError] = useState(false);

  const [text, setText] = useState("");
  const [mailto, setMailto] = useState("");

  const Item = ({ data }) => {
    const { title, placeholder } = data;

    return (
      <div
        className={`item${title === activeTab ? " item-active" : ""}`}
        onClick={() => {
          setActiveTab(title);
          setPlaceholderData(placeholder);
        }}
      >
        {title}
      </div>
    );
  };

  const submit = async () => {
    try {
      setIsLoading(true);
      await api.uninstall.submit({ data: text, mailto: mailto, reason: activeTab, userAgent: navigator.userAgent, user_id: user_id });

      setIsSubmited(true);
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const options = [
    { title: "Расширение не работает корректно", placeholder: "Как мы можем это исправить" },
    { title: "Нет функций, которые мне нужны", placeholder: "Что мы можем добавить" },
    { title: "Мне больше оно не нужно", placeholder: "" },
    { title: "Другое", placeholder: "Описание проблемы или предложения" },
  ];

  useEffect(() => {
    api.uninstall.init(user_id);
  }, [user_id]);

  return (
    <>
      <section className="section-head">
        <div className="container">
          <div className="section-head__title-wrap">
            <div className="section-head__title">Почему вы удаляете расширение BetterWASYA.tv?</div>
          </div>
        </div>
      </section>

      {!isLoading && !isSubmited && !isError && (
        <section className="section-default section-flex">
          <div className="container container-sm">
            <div className="faq-tabs__block">
              <div className="faq-tabs__head">
                <wasd-tab-group _nghost-uup-c145="">
                  <section className="tabs-wrapper filter always-show center medium" style={{ paddingTop: 0 }}>
                    <div className="tabs">
                      <div className="items">
                        {options.map((title, i) => (
                          <Item data={title} key={i} />
                        ))}
                      </div>
                    </div>
                  </section>
                </wasd-tab-group>
              </div>
              <router-outlet></router-outlet>
              <wasd-support _nghost-uup-c336="">
                <div className="test-bar__wrap first" style={{ display: "none" }}>
                  <div className="test-bar__comment"></div>
                </div>
                {placeholderData && (
                  <>
                    <div className="text-question__container first">
                      <textarea
                        className="text-question"
                        placeholder={placeholderData}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="test-bar__wrap second" style={{ margin: "10px 0 10px" }}>
                      <div className="test-bar__comment">Как мы можем с вами связаться</div>
                    </div>

                    <div className="text-question__container second" style={{ height: "50px" }}>
                      <input
                        type="email"
                        className="text-question"
                        placeholder="Discord или Email"
                        style={{ height: "50px" }}
                        value={mailto}
                        onChange={(e) => setMailto(e.target.value)}
                      />
                    </div>
                  </>
                )}
                <div className="send-question">
                  <div className="flat-btn">
                    <button className="primary medium" disabled={!activeTab || (text.length < 5 && placeholderData)} onClick={submit}>
                      <span> Отправить </span>
                    </button>
                  </div>
                </div>
              </wasd-support>
            </div>
          </div>
        </section>
      )}

      {isLoading && (
        <section className="section-default section-flex">
          <div
            className="container container-sm"
            style={{
              fontSize: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="loader_div" style={{ paddingRight: "10px" }}>
              <ButtonLoading />
            </div>
            Загрузка
          </div>
        </section>
      )}

      {isSubmited && (
        <section className="section-default section-flex">
          <div className="container container-sm" style={{ fontSize: "30px", textAlign: "center" }}>
            <i className="wasd-icons-save"></i> Ответ записан
          </div>
        </section>
      )}

      {isError && (
        <section className="section-default section-flex">
          <div className="container container-sm" style={{ fontSize: "24px" }}>
            Ошибка при отправке обратной связи
          </div>
        </section>
      )}
    </>
  );
};

export default Uninstall;
