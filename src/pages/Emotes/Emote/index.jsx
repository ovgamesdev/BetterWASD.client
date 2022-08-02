import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import User from "../../../components/UI/User";
import ButtonLoading from "../../../components/UI/Loading";

import NotFound from "../../NotFound";
import api from "../../../services/api/index.js";
import useAuth from "../../../hooks/useAuth";
import useMeta from "../../../hooks/useMeta/index.tsx";
import useComponentVisible from "../../../hooks/useComponentVisible/index.tsx";
import { decode } from "../../../lib/code-mnem";

import Modal from "../../../components/UI/Modal";
import Time from "../../../components/UI/Time";
import Input from "../../../components/UI/Input";

import styles from "./emote.module.scss";

const Emote = () => {
  const { id } = useParams();
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [isLoadingPersonal, setIsLoadingPersonal] = useState(false);
  const [isLoadingAlias, setIsLoadingAlias] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [aliasCode, setAliasCode] = useState("");

  const { isComponentVisible: showAlias, setIsComponentVisible: setShowAlias, ref } = useComponentVisible();

  const [isChangeMode, setIsChangeMode] = useState(false);

  const [newData, setNewData] = useState(null);
  const [codeError, setCodeError] = useState("");
  const [aliasError, setAliasError] = useState("");

  const codeHandler = (e) => {
    setNewData({ ...newData, code: e.target.value });
    const re = /[^а-яА-Яa-zA-Z0-9]+/g;
    if (re.test(String(e.target.value).toLowerCase())) {
      setCodeError("Ошибка валидации");
    } else {
      if (String(e.target.value).length === 0) {
        setCodeError("Код эмоции не может быть пустым");
      } else if (String(e.target.value).length < 3) {
        setCodeError("Количество сомволов не может быть меньше 3");
      } else if (String(e.target.value).length > 240) {
        setCodeError("Количество сомволов не может быть болоьще 240");
      } else {
        setCodeError("");
      }
    }
  };

  const aliasHandler = (e) => {
    setAliasCode(e.target.value);
    const re = /[^а-яА-Яa-zA-Z0-9]+/g;
    if (re.test(String(e.target.value).toLowerCase())) {
      setAliasError("Ошибка валидации");
    } else {
      if (String(e.target.value).length === 0) {
        setAliasError("");
      } else if (String(e.target.value).length < 3) {
        setAliasError("Количество сомволов не может быть меньше 3");
      } else if (String(e.target.value).length > 240) {
        setAliasError("Количество сомволов не может быть болоьще 240");
      } else {
        setAliasError("");
      }
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: res } = await api.emote.getEmoteById(id, auth.editor?.user_id);
        setData(res);
        setNewData(res);
      } catch (e) {
        console.log(e);
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    setIsChangeMode(false);
    document.querySelector(".wrapper")?.scrollTo({ top: 0, left: 0 });
  }, [id, auth.editor?.user_id]);

  const encoded = decode(data?.code);
  useMeta(
    {
      title: `BetterWASYA | Emote ${data?.code ? "| " + encoded : ""}`,
      description: `Emote ${data?.code ? "| " + encoded : ""}`,
      image: data?.url ? data?.url["x3"] : "",
    },
    [data]
  );

  if (error) return <NotFound />;

  let column = [
    { marginRight: "10px", justifyContent: "flex-start" },
    { marginLeft: "10px" },
    { display: "flex", justifyContent: "center" },
    { width: "100%" },
    { display: "flex", justifyContent: "space-evenly", paddingTop: "5px" },
    { maxWidth: "40%" },
  ];

  const onUpdate = async () => {
    setIsLoadingUpdate(true);
    try {
      const { data: nData } = await api.emote.updateEmote(
        data._id,
        {
          code: newData.code,
          message: newData.message,
          sharing: newData.sharing,
          visibility_simple: newData.visibility_simple,
          global: newData.global,
        },
        auth.editor?.user_id
      );
      setData(nData);
      setNewData(nData);
      toast.success("Эмоция была изменена");

      global.gtag("event", "update_emote", { emote_id: data._id, wasd_user_id: data.user.user_id });
    } catch {
      toast.error("Ошибка при изменении эмоции");
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoadingRemove(true);
      const isDelete = global.confirm("Вы уверены?");
      if (!isDelete) return setIsLoadingRemove(false);

      const { data: nData } = await api.emote.deleteEmote(data._id, auth.editor?.user_id);
      if (nData.ok) {
        setData(null);
        setNewData(null);
        navigate("/dashboard/emotes");
        toast.success("Эмоция успешно удалена");

        global.gtag("event", "delete_emote", { emote_id: data._id, wasd_user_id: data.user.user_id });
      } else {
        toast.error("Ошибка удаления эмоции");
      }
    } catch {
      toast.error("Ошибка при удалении эмоции");
    } finally {
      setIsLoadingRemove(false);
    }
  };

  const likeEmote = async () => {
    try {
      setIsLoadingLike(true);
      if (data.likes.is_liked) {
        const { data: nData } = await api.emote.unlikeEmote(data._id, auth.editor?.user_id);
        if (nData) setData({ ...data, likes: { ...nData } });
        toast.success("Эмоция удалена с вашего канала");
        global.gtag("event", "unlike_emote", { wasd_user_id: auth.user.user_id, user_login: auth.user.user_login, emote_id: data._id });
      } else {
        const { data: nData } = await api.emote.likeEmote(data._id, auth.editor?.user_id);
        if (nData) setData({ ...data, likes: { ...nData } });
        toast.success("Эмоция добавлена на ваш канал");
        global.gtag("event", "like_emote", { wasd_user_id: auth.user.user_id, user_login: auth.user.user_login, emote_id: data._id });
      }
    } catch {
      if (data.likes.is_liked) {
        toast.error("Ошибка при удалении эмоции из вашего канала");
      } else {
        toast.error("Ошибка при добавлении эмоции на ваш канал");
      }
    } finally {
      setIsLoadingLike(false);
    }
  };

  const personalEmote = async () => {
    setIsLoadingPersonal(true);
    if (data.personals.is_personaled) {
      const { data: nData } = await api.emote.personalEmote(data._id, auth.editor?.user_id);
      if (typeof nData.users === "object") {
        setData({ ...data, personals: { ...nData } });
        toast.success("Удалена персональная эмоция");
        global.gtag("event", "unpersonal_emote", { wasd_user_id: auth.user.user_id, user_login: auth.user.user_login, emote_id: data._id });
      } else {
        toast.info(nData.message);
      }
    } else {
      const { data: nData } = await api.emote.unpersonalEmote(data._id, auth.editor?.user_id);
      if (typeof nData.users === "object") {
        setData({ ...data, personals: { ...nData } });
        toast.success("Добавлена персональная эмоция");
        global.gtag("event", "personal_emote", { wasd_user_id: auth.user.user_id, user_login: auth.user.user_login, emote_id: data._id });
      } else {
        toast.info(nData.message);
      }
    }
    setIsLoadingPersonal(false);
  };

  const setAlias = async () => {
    try {
      if (data.alias === null && aliasCode === "") {
        return setShowAlias(false);
      }

      setIsLoadingAlias(true);
      if (aliasCode === "") {
        const { data: nData } = await api.emote.deleteAlias(data._id, auth.editor?.user_id);
        if (nData.ok === true) setData({ ...data, alias: null });
        toast.success("Псевдоним успешно удален");
        global.gtag("event", "delete_alias_emote", {
          wasd_user_id: auth.user.user_id,
          user_login: auth.user.user_login,
          emote_id: data._id,
          old_alias: data.alias,
          new_alias: "",
        });
      } else {
        const { data: nData } = await api.emote.updateAlias(data._id, aliasCode, auth.editor?.user_id);
        if (nData) setData({ ...data, alias: nData.alias });
        toast.success("Псевдоним успешно изменен");
        global.gtag("event", "create_alias_emote", {
          wasd_user_id: auth.user.user_id,
          user_login: auth.user.user_login,
          emote_id: data._id,
          old_alias: data.alias,
          new_alias: nData.alias,
        });
      }
    } catch {
      toast.error("Ошибка при удалении псевдонима");
    } finally {
      setIsLoadingAlias(false);
      setAliasCode("");
      setShowAlias(false);
    }
  };

  const isOwner = auth.editor
    ? typeof data?.user?.user_id !== "undefined" && data?.user?.user_id === auth.editor?.user_id
    : typeof data?.user?.user_id !== "undefined" && data?.user?.user_id === auth.user?.user_id;
  // const is = isOwner || auth.user?.user_role === "ADMIN";

  if (!data) return null;

  if (isLoading) {
    return (
      <div className="item item__rigtt" style={{ width: "100%" }}>
        <div className={styles.root + " " + styles.block + " skelet-loading"} style={column[3]}>
          <div className={styles["root-header"]}>
            <div style={{ width: "150px", height: "18px", marginRight: "50px" }} className="loading" />
            <div style={{ width: "180px", height: "18px" }} className="loading" />
          </div>
          <div className={styles["root-body"]}>
            <div className={styles.content}>
              <img
                width={28}
                height={28}
                src="data:image/gif;base64,R0lGODlhAQABAPcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAABAAEAAAgEAP8FBAA7"
                alt="1x"
                className="loading"
              />
              <img
                width={56}
                height={56}
                src="data:image/gif;base64,R0lGODlhAQABAPcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAABAAEAAAgEAP8FBAA7"
                alt="2x"
                className="loading"
              />
              <img
                width={112}
                height={112}
                src="data:image/gif;base64,R0lGODlhAQABAPcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAABAAEAAAgEAP8FBAA7"
                alt="3x"
                className="loading"
              />
            </div>
            <div className="date loading" style={{ width: "150px", height: "14px", position: "absolute" }} />
          </div>
          {auth.user ? (
            <div className={styles["root-footer"] + " flat-btn"}>
              <div style={{ width: "165px", height: "32px" }} className="loading" />
              <div style={{ width: "165px", height: "32px", marginLeft: "5px" }} className="loading" />
            </div>
          ) : null}
        </div>
        <div className={styles.root + " " + styles.block + " skelet-loading"}>
          <div className={styles["root-header"]}>
            <div style={{ width: "100px", height: "18px" }} className="loading" />
          </div>
          <div className={styles["root-body"]}>
            <div className="emotes">
              {Array(10)
                .fill({})
                .map((user, index) => (
                  <User key={user.user_id || index} user={user} loading={isLoading} />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="item item__rigtt" style={{ width: "100%" }}>
        {!isChangeMode && (
          <div className={styles.root + " " + styles.block} style={column[3]}>
            <div className={styles["root-header"]}>
              <div className={styles.title}>
                {encoded}
                {data.alias && <span className={styles.alias}>({data.alias})</span>}
              </div>
              <div className={styles.state}>
                {!data.sharing && <div className={styles.private}>ПРИВАТНАЯ ЭМОЦИЯ</div>}
                {!!data.visibility_simple?.filter((t) => t === "ZERO_WIDTH").length && <div className={styles.zero_width}>ZERO-WIDTH</div>}
              </div>
              {data.global !== false ? (
                <div>Глобальная эмоция</div>
              ) : (
                <div className={styles.user_login}>
                  автор
                  <img src={data.user.channel_image} alt="ava" />
                  <Link to={"/users/" + data.user.user_id}>{data.user.user_login}</Link>
                </div>
              )}
            </div>
            <div className={styles["root-body"]}>
              <div className={styles.content}>
                <img style={column[5]} src={data.url["x1"]} alt="1x" />
                <img style={column[5]} src={data.url["x2"]} alt="2x" />
                <img style={column[5]} src={data.url["x3"]} alt="3x" />
              </div>

              <Time className={styles.date} date={new Date(data.createdAt)} format="Создано DD.MM.YYYY" />
            </div>
            {data.global === false && !isOwner && auth.user && (data.sharing || auth.user?.user_role !== "ADMIN") ? (
              <div className={styles["root-footer"] + " flat-btn"}>
                {auth.user?.user_role === "ADMIN" && (
                  <button onClick={() => setIsChangeMode(true)} style={{ minWidth: "167px" }} className={`medium primary`}>
                    Изменить эмоцию
                  </button>
                )}
                {data.sharing && !data.global && (
                  <>
                    <button onClick={likeEmote} style={{ minWidth: "167px" }} disabled={isLoadingLike} className={`medium ${data.likes.is_liked ? "warning" : "primary"}`}>
                      {isLoadingLike ? <ButtonLoading /> : data.likes.is_liked ? "Удалить из канала" : "Добавить на канал"}
                    </button>
                    <button onClick={() => setShowAlias(true)} style={{ minWidth: "167px" }} className={`medium primary`}>
                      Изменить псевдоним
                    </button>
                    {auth.user.is_subscriber_active && !auth.editor && (
                      <button onClick={personalEmote} style={{ minWidth: "167px" }} disabled={isLoadingPersonal} className={`medium ${data.personals?.is_personaled ? "warning" : "primary"}`}>
                        {isLoadingPersonal ? <ButtonLoading /> : data.personals?.is_personaled ? "Удалить из персональных" : "Добавить как персональную"}
                      </button>
                    )}
                  </>
                )}
              </div>
            ) : (
              isOwner && (
                <div className={styles["root-footer"] + " flat-btn"} style={{ display: "flex" }}>
                  <button onClick={() => setIsChangeMode(true)} style={{ minWidth: "167px" }} className={`medium primary`}>
                    Изменить эмоцию
                  </button>
                  {!data.global && (
                    <button onClick={() => setShowAlias(true)} style={{ minWidth: "167px" }} className={`medium primary`}>
                      Изменить псевдоним
                    </button>
                  )}
                  {auth.user.is_subscriber_active && !auth.editor && (
                    <button onClick={personalEmote} style={{ minWidth: "167px" }} disabled={isLoadingPersonal} className={`medium ${data.personals?.is_personaled ? "warning" : "primary"}`}>
                      {isLoadingPersonal ? <ButtonLoading /> : data.personals?.is_personaled ? "Удалить из персональных" : "Добавить как персональную"}
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        )}
        {data?.likes?.total !== 0 && !isChangeMode && (
          <div className={styles.root + " " + styles.block} style={column[3]}>
            <div className={styles["root-header"]}>
              <div className={styles.title}>Каналы ({data?.likes?.total})</div>
            </div>
            <div className={styles["root-body"]}>
              <div className="emotes">{data && data.likes && data.likes.users ? data.likes.users.map((user) => <User key={user.user_id} user={user} />) : null}</div>
            </div>
          </div>
        )}
        {isChangeMode && (
          <div className={styles.root + " " + styles.block} style={column[3]}>
            <div className={styles["root-header"]}>
              <div className={styles.title}>
                Настройка
                <img src={data.url["x1"]} alt="emote" />
              </div>
              <div className={styles.user_login}>
                автор
                <img src={data.user.channel_image} alt="ava" />
                <Link to={"/users/" + data.user.user_id}>{data.user.user_login}</Link>
              </div>
            </div>
            <div className={styles["root-body"]}>
              <div>
                <span>Код эмоции</span>
                {codeError && (
                  <span className="error" style={{ paddingLeft: "5px" }}>
                    {codeError}
                  </span>
                )}
              </div>

              <Input className={codeError ? "warning" : ""} style={{ margin: "4px 0 0" }} value={newData.code || ""} onChange={(e) => codeHandler(e)} placeholder="Код эмоции" />

              <p style={{ paddingTop: "5px", color: "var(--wasd-color-text-third)" }}>Коды эмоций могут быть буквами и цифрами. Не менее 3 символов.</p>

              <div>Примечания об утверждении</div>

              <Input
                type="textarea"
                inputStyle={{ height: "100px", maxHeight: "200px", minHeight: "40px" }}
                style={{ margin: "4px 0 0" }}
                value={newData.message || ""}
                onChange={(e) => setNewData({ ...newData, message: e.target.value })}
              />

              <p style={{ paddingTop: "5px", color: "var(--wasd-color-text-third)" }}>
                Если ваша эмоция будет решена для проверки вручную (либо автоматически, либо кем-то, кто сообщил об этом), пожалуйста, объясните эту эмоцию и предоставьте обоснование для
                использования.
              </p>

              <div className="hover-pointer">
                <input id="sharing" type="checkbox" checked={newData.sharing || false} onChange={(e) => setNewData({ ...newData, sharing: e.target.checked })} />
                <label htmlFor="sharing" style={{ marginLeft: "5px" }}>
                  Совместное использование
                </label>
              </div>

              <p style={{ paddingTop: "5px", color: "var(--wasd-color-text-third)" }}>Включение общего доступа позволяет другим пользователям добавлять эту эмоцию в свой чат WASD.TV.</p>

              {auth.user?.user_role === "ADMIN" && (
                <div className="hover-pointer">
                  <input
                    id="zero_width"
                    type="checkbox"
                    checked={!!newData.visibility_simple.filter((t) => t === "ZERO_WIDTH").length}
                    onChange={(e) =>
                      setNewData({
                        ...newData,
                        visibility_simple: e.target.checked ? ["ZERO_WIDTH"] : [],
                      })
                    }
                  />
                  <label htmlFor="zero_width" style={{ marginLeft: "5px" }}>
                    Эмоция нулевой ширины
                  </label>
                </div>
              )}

              {auth.user?.user_role === "ADMIN" && <br />}

              {auth.user?.user_role === "ADMIN" && (
                <div className="hover-pointer">
                  <input id="global" type="checkbox" checked={newData.global || false} onChange={(e) => setNewData({ ...newData, global: e.target.checked })} />
                  <label htmlFor="global" style={{ marginLeft: "5px" }}>
                    Глобальная эмоция
                  </label>
                </div>
              )}
            </div>
            <div className={styles["root-footer"] + " flat-btn"}>
              <button onClick={() => setIsChangeMode(false)} className="primary medium" style={{ width: "164px" }}>
                Обратно к эмоции
              </button>
              <button
                onClick={onUpdate}
                disabled={
                  isLoadingUpdate ||
                  codeError ||
                  !(
                    data.code !== newData.code ||
                    data.global !== newData.global ||
                    data.sharing !== newData.sharing ||
                    !!data.visibility_simple?.filter((t) => t === "ZERO_WIDTH").length !== !!newData.visibility_simple?.filter((t) => t === "ZERO_WIDTH").length ||
                    data.message !== newData.message
                  )
                }
                className="primary medium"
                style={{ width: "166px" }}
              >
                {isLoadingUpdate ? <ButtonLoading /> : "Обновить эмоцию"}
              </button>
              <button onClick={onDelete} disabled={isLoadingRemove} className="warning medium" style={{ width: "164px" }}>
                {isLoadingRemove ? <ButtonLoading /> : "Удалить эмоцию"}
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isShow={showAlias} visibleRef={ref}>
        <span style={{ wordBreak: "break-word" }}>
          Псевдоним эмоции «{data.code}» для канала {auth.editor?.user_login || auth.user?.user_login}
        </span>
        <>
          <span style={{ color: "#fff", fontSize: "16px" }}>Код эмоции</span>
          <Input
            className={aliasError ? " warning" : ""}
            style={{ flexDirection: "column", alignItems: "stretch" }}
            placeholder={data.code}
            value={aliasCode}
            onChange={(e) => aliasHandler(e)}
            disabled={isLoading}
          />
          {aliasError && (
            <span className="error" style={{ marginTop: "5px" }}>
              {aliasError}
            </span>
          )}
          <p style={{ paddingTop: "5px", color: "var(--wasd-color-text-third)" }}>Коды эмоций могут быть буквами и цифрами. Не менее 3 символов.</p>
        </>
        <div className="flat-btn" style={{ display: "flex" }}>
          <button className="medium basic hide" style={{ marginRight: "5px" }} onClick={() => setShowAlias(false)}>
            отмена
          </button>
          <button disabled={aliasError || isLoadingAlias} style={{ width: "141.2px" }} className="medium primary" onClick={() => setAlias()}>
            {isLoadingAlias ? <ButtonLoading /> : "переименовать"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Emote;
