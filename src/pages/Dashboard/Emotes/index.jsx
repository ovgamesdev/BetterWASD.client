import React, { useState, useEffect } from "react";
import Emote from "../../../components/UI/Emote";
import useTitle from "../../../hooks/useTitle/index.tsx";
import ButtonLoading from "../../../components/UI/Loading";
import api from "../../../services/api";
import classnames from "classnames";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

import styles from "./../../modal.module.scss";

const DashboardEmotes = () => {
  useTitle("BetterWASD | Эмоции");
  const navigate = useNavigate();
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCreateEmote, setIsLoadingCreateEmote] = useState(false);
  const [data, setData] = useState({});
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [url, setURL] = useState("");

  const [createEmote, setCreateEmote] = useState({});

  useEffect(() => {
    setData({
      channelEmotes: Array(12 * 3).fill({}),
      sharedEmotes: 0,
      personalEmotes: 0,
    });
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: jdata } = await api.emote.getDashboardEmotes(
          auth.editor?.user_id
        );
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
      const { data } = await api.emote.postTvEmote(
        { url: url },
        auth.editor?.user_id
      );
      if (data.message && data._id && data.code) {
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
      const { data } = await api.emote.postTvEmote(
        { url: url, recreate: true },
        auth.editor?.user_id
      );
      if (data.message && data._id && data.code) {
        navigate("/emotes/" + data._id);
      } else {
        setCreateEmote(data);
      }
    } catch (e) {
      setError(e.response.data.message);
    }
    setIsLoadingCreateEmote(false);
  };

  return (
    <>
      <div className="item block item_right" style={{ marginTop: "0px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="item__title"> Эмоции </div>
          <div className="flat-btn ovg" style={{ display: "flex" }}>
            <button
              onClick={() => {
                setShow(true);
                setError(null);
                setCreateEmote(null);
              }}
              className={classnames("primary", "medium", "ovg")}
            >
              Создать эмоцию
            </button>
          </div>
        </div>
        <div className="item__descr">
          Любые смайлики, добавленные здесь, могут использоваться в чате вашего
          канала на WASD.TV как вами, так и вашими зрителями.
        </div>
        <div className="item__border"></div>

        {data.channelEmotes?.length ||
        data.sharedEmotes?.length ||
        data.personalEmotes?.length
          ? null
          : "Вы еще на добавили эмоции на свой канал"}

        {data.channelEmotes?.length ? (
          <div className="item__title">
            Эмоции канала ({data.channelEmotes?.length}/∞)
          </div>
        ) : null}
        <div className="emotes">
          {data.channelEmotes?.length
            ? data.channelEmotes.map((emote, index) => (
                <Emote
                  key={emote._id || index}
                  emote={emote}
                  loading={isLoading}
                />
              ))
            : null}
        </div>

        {data.personalEmotes?.length ? (
          <div className="item__title" style={{ marginTop: "25px" }}>
            Персональные эмоции ({data.personalEmotes?.length}/
            {auth.user.limits.personalEmotes})
          </div>
        ) : null}
        <div className="emotes">
          {data.personalEmotes?.length
            ? data.personalEmotes.map((emote, index) => (
                <Emote
                  showUsername={true}
                  key={emote._id || index}
                  emote={emote}
                  loading={isLoading}
                />
              ))
            : null}
        </div>

        {data.sharedEmotes?.length ? (
          <div className="item__title" style={{ marginTop: "25px" }}>
            Общие эмоции ({data.sharedEmotes?.length}/∞)
          </div>
        ) : null}
        <div className="emotes">
          {data.sharedEmotes?.length
            ? data.sharedEmotes.map((emote, index) => (
                <Emote
                  showUsername={true}
                  key={emote._id || index}
                  emote={emote}
                  loading={isLoading}
                />
              ))
            : null}
        </div>
      </div>

      {show && <ovg-modal-backdrop></ovg-modal-backdrop>}
      {show && (
        <ovg-modal-window
          data-show="show"
          className={styles["show"]}
          onClick={(e) => {
            !isLoading &&
              setShow(
                !(
                  e.target.dataset.show === "show" ||
                  e.target.className.match("hide")
                )
              );
            setError(null);
          }}
        >
          <div
            className={
              styles["modal-block"] + " " + styles["modal-block_medium"]
            }
            style={{ width: "440px" }}
          >
            <div className={styles["modal-block__title"]}>
              <span> Создание эмоции из 7tv.app </span>
            </div>

            <div
              className={styles["modal-block__content"]}
              style={{ padding: "0 24px" }}
            >
              <div className={styles.row}>
                <div className="col-36">
                  <label>
                    На данный момент доступна возможность клонировать эмоцию из{" "}
                    <a
                      href="https://7tv.app/emotes"
                      target="_blank"
                      rel="noreferrer"
                    >
                      7tv.app
                    </a>
                  </label>
                  <br></br>
                  <br></br>
                  <label> Ссылка на эмоцию </label>
                </div>
                <div className="col-64">
                  <wasd-input>
                    <div
                      ovg=""
                      className="wasd-input-wrapper"
                      style={{ flexDirection: "column", alignItems: "stretch" }}
                    >
                      <div ovg="" className="wasd-input">
                        <input
                          ovg=""
                          placeholder="https://7tv.app/emotes/000000000000000000000000"
                          type="text"
                          className={classnames(isLoading && "disabled")}
                          onChange={(e) => inputChange(e)}
                        ></input>
                      </div>

                      {createEmote?.message && createEmote._id && (
                        <div
                          style={{
                            display: "flex",
                            marginTop: "5px",
                            fontSize: "12px",
                            marginRight: "5px",
                          }}
                        >
                          <span> {createEmote?.message} </span>

                          <Link
                            style={{ marginLeft: "5px" }}
                            to={`/emotes/${createEmote._id}`}
                          >
                            Просмотреть
                          </Link>
                        </div>
                      )}

                      {createEmote?.message && createEmote._id && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "5px",
                            fontSize: "12px",
                          }}
                        >
                          <span className=""> Создать новую эмоцю? </span>

                          {/* <img width={32} height={32} alt="1" src={HOSTURL + "/cached/emote/"+createEmote?._id+"/1x"}/> */}

                          {/* <img width={32} height={32} alt="2" src={createEmote?.newImg}/> */}
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
                {/* <div className="col-36" style={{display:'none'}}>
									<br></br>
	                <label style={{fontSize: '13px'}}> *Сгененируцте новый токен а после чего вставьте в поле выше* </label>
									<br></br>
									<br></br>
	              </div> */}
              </div>
            </div>

            <div className={styles["modal-block__footer"]}>
              <div className="flat-btn ovg" style={{ display: "flex" }}>
                <button
                  className={classnames(
                    "medium",
                    "ovg",
                    "basic",
                    "hide",
                    isLoading && "disabled"
                  )}
                  style={{ marginRight: "5px" }}
                >
                  отмена
                </button>
                {createEmote?.message && createEmote._id ? (
                  <button
                    disabled={isLoadingCreateEmote}
                    style={{ width: "141.2px" }}
                    className={classnames(
                      "primary",
                      "medium",
                      "ovg",
                      (isLoading || url === "" || createEmote?.message) &&
                        !createEmote?._id &&
                        "disabled"
                    )}
                    onClick={() => onReCreate()}
                  >
                    {isLoadingCreateEmote ? <ButtonLoading /> : "создать новую"}
                  </button>
                ) : (
                  <button
                    disabled={isLoadingCreateEmote}
                    style={{ width: "100px" }}
                    className={classnames(
                      "primary",
                      "medium",
                      "ovg",
                      (isLoading || url === "" || createEmote?.message) &&
                        createEmote?._id &&
                        "disabled"
                    )}
                    onClick={() => onSubmit()}
                  >
                    {isLoadingCreateEmote ? <ButtonLoading /> : "добавить"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </ovg-modal-window>
      )}
    </>
  );
};

export default DashboardEmotes;
