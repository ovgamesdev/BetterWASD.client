import { useState } from "react";
import { useParams } from "react-router-dom";

import Input from "../../components/UI/Input";
import ButtonLoading from "../../components/UI/Loading";

import useMeta from "../../hooks/useMeta/index.tsx";
import api from "../../services/api";

const FagSupport = () => {
  useMeta({ title: "BetterWASYA | Обратная связь" });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);
  const [isError, setIsError] = useState(false);

  const [text, setText] = useState("");
  const [email, setEmail] = useState("");

  const { id } = useParams();

  const submit = async () => {
    try {
      setIsError(false);
      setIsLoading(true);

      if (!id) await api.support.create(text, email);
      if (id) await api.support.reply(id, text, email);

      setIsSubmited(true);
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "150px" }}>
      {!isLoading && !isSubmited && !isError && (
        <section className="section-default section-flex">
          <div className="container container-sm">
            <div className="faq-tabs__block">
              <wasd-support _nghost-uup-c336="">
                <div className="test-bar__wrap first">
                  <div className="test-bar__comment">Есть вопросы или проблемы? Напиши нам и мы все решим</div>
                </div>

                <Input
                  type="textarea"
                  placeholder="Описание проблемы или предложения"
                  style={{ marginBottom: "2rem" }}
                  inputClassName="text-question"
                  className="text-question__container"
                  inputStyle={{ height: "100%", resize: "none", fontSize: "20px", margin: "0" }}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />

                <div className="test-bar__wrap second" style={{ margin: "10px 0 10px" }}>
                  <div className="test-bar__comment">Как мы можем с вами связаться</div>
                </div>

                <Input
                  type="email"
                  placeholder="email"
                  style={{ marginBottom: "2rem" }}
                  inputStyle={{ height: "50px", fontSize: "20px", margin: "0" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div className="send-question">
                  <div className="flat-btn">
                    <button className="primary medium" disabled={text.length < 5} onClick={submit}>
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
          <div className="container container-sm" style={{ fontSize: "30px", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
            <i className="wasd-icons-save" /> Ответ записан
          </div>
          <div className="test-bar__wrap first">
            <div className="test-bar__comment">Ожидайте ответ в уведомлениях</div>
          </div>
        </section>
      )}

      {isError && (
        <section className="section-default section-flex">
          <div className="container container-sm" style={{ fontSize: "24px", textAlign: "center" }}>
            Ошибка при отправке обратной связи
          </div>
          <div className="test-bar__wrap first">
            <div className="test-bar__comment" style={{ color: "rgb(40 100 200)", cursor: "pointer" }} onClick={submit}>
              Повторить попытку
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default FagSupport;
