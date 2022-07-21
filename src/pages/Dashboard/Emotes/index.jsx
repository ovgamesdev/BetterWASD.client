import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import Emote from "../../../components/UI/Emote";
import ButtonLoading from "../../../components/UI/Loading";
import Modal from "../../../components/UI/Modal";

import api from "../../../services/api/index.js";
import useAuth from "../../../hooks/useAuth";
import useMeta from "../../../hooks/useMeta/index.tsx";
import useComponentVisible from "../../../hooks/useComponentVisible/index.tsx";

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

  const { isComponentVisible: show, setIsComponentVisible: setShow, ref } = useComponentVisible();

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
        <div className="item__descr">
          Любые смайлики, добавленные здесь, могут использоваться в чате вашего канала на WASD.TV как вами, так и вашими зрителями.
        </div>
        <div className="item__border" />

        {data.channelEmotes?.length || data.sharedEmotes?.length || data.personalEmotes?.length
          ? null
          : "Вы еще на добавили эмоции на свой канал"}

        {data.channelEmotes?.length !== 0 && <div className="item__title">Эмоции канала ({data.channelEmotes?.length}/∞)</div>}
        <div className="emotes">
          {data.channelEmotes?.length &&
            data.channelEmotes.map((emote, index) => <Emote key={emote._id || index} emote={emote} loading={isLoading} />)}
        </div>

        {data.personalEmotes?.length !== 0 && (
          <div className="item__title" style={{ marginTop: "25px" }}>
            Персональные эмоции ({data.personalEmotes.length}/{auth.user.limits.personalEmotes})
          </div>
        )}
        <div className="emotes">
          {data.personalEmotes?.length !== 0 &&
            data.personalEmotes.map((emote, index) => (
              <Emote showUsername={true} key={emote._id || index} emote={emote} loading={isLoading} />
            ))}
        </div>

        {data.sharedEmotes?.length !== 0 && (
          <div className="item__title" style={{ marginTop: "25px" }}>
            Общие эмоции ({data.sharedEmotes.length}/∞)
          </div>
        )}
        <div className="emotes">
          {data.sharedEmotes?.length !== 0 &&
            data.sharedEmotes.map((emote, index) => (
              <Emote showUsername={true} key={emote._id || index} emote={emote} loading={isLoading} />
            ))}
        </div>
      </div>

      <Modal isShow={show} visibleRef={ref}>
        <span> Создание эмоции из 7tv.app </span>
        <>
          <div className="col-36">
            <label>
              На данный момент доступна возможность клонировать эмоцию из{" "}
              <a href="https://7tv.app/emotes" target="_blank" rel="noreferrer">
                7tv.app
              </a>
            </label>
            <br />
            <br />
            <label> Ссылка на эмоцию </label>
          </div>
          <div className="col-64">
            <wasd-input>
              <div className="wasd-input-wrapper" style={{ flexDirection: "column", alignItems: "stretch" }}>
                <div className="wasd-input">
                  <input
                    placeholder="https://7tv.app/emotes/000000000000000000000000"
                    type="text"
                    className={isLoading ? "disabled" : ""}
                    autoFocus={true}
                    onChange={(e) => inputChange(e)}
                  />
                </div>

                {createEmote?.message && createEmote._id && (
                  <div style={{ display: "flex", marginTop: "5px", fontSize: "12px", marginRight: "5px" }}>
                    <span> {createEmote?.message} </span>

                    <Link style={{ marginLeft: "5px" }} to={`/emotes/${createEmote._id}`}>
                      Просмотреть
                    </Link>
                  </div>
                )}

                {createEmote?.message && createEmote._id && (
                  <div style={{ display: "flex", alignItems: "center", marginTop: "5px", fontSize: "12px" }}>
                    <span> Создать новую эмоцю? </span>
                  </div>
                )}

                {error && (
                  <span className="error" style={{ marginTop: "5px" }}>
                    {error}
                  </span>
                )}
              </div>
            </wasd-input>
          </div>
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
