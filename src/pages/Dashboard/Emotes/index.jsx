import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import Emote from "../../../components/UI/Emote";
import ButtonLoading from "../../../components/UI/Loading";
import Modal from "../../../components/UI/Modal";
import Input from "../../../components/UI/Input";

import api from "../../../services/api/index.js";
import useAuth from "../../../hooks/useAuth";
import useMeta from "../../../hooks/useMeta/index.tsx";
import useComponentVisible from "../../../hooks/useComponentVisible/index.tsx";

const services = {
  "7tv": {
    name: "7tv.app",
    home_page: "https://7tv.app/emotes",
    emote_page: "https://7tv.app/emotes/000000000000000000000000",
  },
  bttv: {
    name: "BetterTTV",
    home_page: "https://betterttv.com/emotes/top",
    emote_page: "https://betterttv.com/emotes/000000000000000000000000",
  },
  ffz: {
    name: "FrankerFaceZ",
    home_page: "https://www.frankerfacez.com/emoticons/",
    emote_page: "https://www.frankerfacez.com/emoticon/000000-EMOTE",
  },
};

const DashboardEmotes = () => {
  useMeta({ title: "BetterWASYA | Эмоции" });
  const navigate = useNavigate();
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCreateEmote, setIsLoadingCreateEmote] = useState(false);
  const [data, setData] = useState({ channelEmotes: Array(12 * 3).fill({}), sharedEmotes: [], personalEmotes: [] });
  const [error, setError] = useState(null);
  const [url, setURL] = useState("");

  const [createEmote, setCreateEmote] = useState({});
  const [activeService, setActiveService] = useState("7tv");

  const { isComponentVisible: show, setIsComponentVisible: setShow, ref } = useComponentVisible();

  useEffect(() => {
    if (!show || url !== "") return;
    const update = setInterval(() => setActiveService((v) => (v === "7tv" ? "bttv" : v === "bttv" ? "ffz" : v === "ffz" ? "7tv" : "bttv")), 2500);
    return () => clearInterval(update);
  }, [activeService, show, url]);

  useEffect(() => {
    setData({ channelEmotes: Array(12 * 3).fill({}), sharedEmotes: [], personalEmotes: [] });
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: jdata } = await api.emote.getDashboardEmotes(auth.editor?.user_id);
        setData(jdata);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [auth.editor?.user_id]);

  const inputChange = (e) => {
    setURL(e.target.value.trim());
    setError(null);
    setCreateEmote(null);
  };

  const onSubmit = async () => {
    setIsLoadingCreateEmote(true);
    try {
      const { data } = await api.emote.postTvEmote({ url: url }, auth.editor?.user_id);
      if (data.message && data._id && data.code) {
        global.gtag("event", "create_emote", { emote_id: data._id, wasd_user_id: data.user.user_id });

        navigate("/emotes/" + data._id);
      } else {
        setCreateEmote(data);
      }
    } catch (e) {
      setError(e.response.data.message);
    }
    setIsLoadingCreateEmote(false);
  };

  const onReCreate = async () => {
    setIsLoadingCreateEmote(true);
    try {
      const { data } = await api.emote.postTvEmote({ url: url, recreate: true }, auth.editor?.user_id);
      if (data.message && data._id && data.code) {
        global.gtag("event", "create_emote", { emote_id: data._id, wasd_user_id: data.user.user_id });

        navigate("/emotes/" + data._id);
      } else {
        setCreateEmote(data);
      }
    } catch (e) {
      setError(e.response.data.message);
    }
    setIsLoadingCreateEmote(false);
  };

  if (!data.channelEmotes || !data.sharedEmotes || !data.personalEmotes) return null;

  return (
    <>
      <div className="item block item_right" style={{ marginTop: "0px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="item__title"> Эмоции </div>
          <div className="flat-btn" style={{ display: "flex" }}>
            <button
              onClick={() => {
                setShow(true);
                setError(null);
                setCreateEmote(null);
              }}
              className="primary medium"
            >
              Создать эмоцию
            </button>
          </div>
        </div>
        <div className="item__descr">Любые смайлики, добавленные здесь, могут использоваться в чате вашего канала на WASD.TV как вами, так и вашими зрителями.</div>
        <div className="item__border" />

        {data.channelEmotes?.length !== 0 || data.sharedEmotes?.length !== 0 || data.personalEmotes?.length !== 0 ? null : "Вы еще на добавили эмоции на свой канал"}

        {data.channelEmotes?.length !== 0 && <div className="item__title">Эмоции канала ({data.channelEmotes?.length}/∞)</div>}
        <div className="emotes">{data.channelEmotes?.length !== 0 && data.channelEmotes.map((emote, index) => <Emote key={emote._id || index} emote={emote} loading={isLoading} />)}</div>

        {data.personalEmotes?.length !== 0 && (
          <div className="item__title" style={{ marginTop: "25px" }}>
            Персональные эмоции ({data.personalEmotes.length}/{auth.user.limits.personalEmotes})
          </div>
        )}
        <div className="emotes">
          {data.personalEmotes?.length !== 0 && data.personalEmotes.map((emote, index) => <Emote showUsername={true} key={emote._id || index} emote={emote} loading={isLoading} />)}
        </div>

        {data.sharedEmotes?.length !== 0 && (
          <div className="item__title" style={{ marginTop: "25px" }}>
            Общие эмоции ({data.sharedEmotes.length}/∞)
          </div>
        )}
        <div className="emotes">
          {data.sharedEmotes?.length !== 0 && data.sharedEmotes.map((emote, index) => <Emote showUsername={true} key={emote._id || index} emote={emote} loading={isLoading} />)}
        </div>
      </div>

      <Modal isShow={show} visibleRef={ref}>
        <span>Создание эмоции</span>
        <>
          <div style={{ fontSize: "16px", marginTop: "5px" }}>Можно клонировать эмоции из таких источников:</div>
          <div style={{ margin: "5px 0 5px 0", fontSize: "16px" }}>
            <a target="_blank" rel="noreferrer" href={services["7tv"].home_page} style={{ margin: "0 10px 0 0" }}>
              {services["7tv"].name}
            </a>
            <a target="_blank" rel="noreferrer" href={services["bttv"].home_page} style={{ margin: "0 10px" }}>
              {services["bttv"].name}
            </a>
            <a target="_blank" rel="noreferrer" href={services["ffz"].home_page} style={{ margin: "0 0 0 10px" }}>
              {services["ffz"].name}
            </a>
          </div>

          <label> Ссылка на эмоцию </label>
          <Input
            placeholder={services[activeService].emote_page}
            inputClassName={isLoading ? "disabled" : ""}
            autoFocus
            value={url}
            onChange={(e) => inputChange(e)}
            style={{ flexDirection: "column", alignItems: "stretch", marginTop: "5px" }}
          />
          {createEmote?.message && createEmote._id && (
            <>
              <div style={{ display: "flex", marginTop: "5px", fontSize: "12px", marginRight: "5px", alignItems: "center" }}>
                <span> {createEmote?.message} </span>
                <img src={createEmote.newImg} alt="preview" style={{ marginLeft: "15px" }} />
                <Link style={{ marginLeft: "5px" }} to={`/emotes/${createEmote._id}`}>
                  Просмотреть
                </Link>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginTop: "5px", fontSize: "12px" }}>
                <span> Создать новую эмоцю? </span>
              </div>
            </>
          )}

          {error && (
            <span className="error" style={{ marginTop: "5px" }}>
              {error}
            </span>
          )}
        </>
        <div className="flat-btn" style={{ display: "flex" }}>
          <button className={`medium basic ${isLoading ? "disabled" : ""}`} style={{ marginRight: "5px" }} onClick={() => setShow(false)}>
            отмена
          </button>
          {createEmote?.message && createEmote._id ? (
            <button
              disabled={isLoadingCreateEmote}
              style={{ width: "141.2px" }}
              className={`primary medium ${(isLoading || url === "" || createEmote?.message) && !createEmote?._id ? "disabled" : ""}`}
              onClick={() => onReCreate()}
            >
              {isLoadingCreateEmote ? <ButtonLoading /> : "создать новую"}
            </button>
          ) : (
            <button
              disabled={isLoadingCreateEmote}
              style={{ width: "100px" }}
              className={`primary medium ${(isLoading || url === "" || createEmote?.message) && createEmote?._id ? "disabled" : ""}`}
              onClick={() => onSubmit()}
            >
              {isLoadingCreateEmote ? <ButtonLoading /> : "добавить"}
            </button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default DashboardEmotes;
