import React, { useState, useEffect } from "react";
import useTitle from "../../../hooks/useTitle/index.tsx";
import EditorUser from "../../../components/UI/EditorUser";
import api from "../../../services/api";
import useAuth from "../../../hooks/useAuth";
import classnames from "classnames";
import "./../../user.css";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/UI/Loading";

const DashboardEditor = () => {
  useTitle("BetterWASD | Редакторы");
  const auth = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [data, setData] = useState(Array(2).fill({}));
  const [error, setError] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: jdata } = await api.auth.getEditors();
        setData(jdata);
      } catch (e) {
        console.log(e);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (typeof auth.editor?.user_id !== "undefined")
      return navigate("/dashboard/emotes");

    fetchData();
  }, [auth.editor?.user_id, navigate]);

  const handler = async (e) => {
    setError(null);
    if (e.key === "Enter") {
      setIsLoadingAdd(true);
      try {
        const { data: jdata } = await api.auth.addEditor({
          user_login: e.target.value.trim(),
        });
        setData([...data, jdata]);
      } catch (e) {
        setError(e.response.data);
      }

      e.target.value = "";
      setIsFocus(false);
      setIsLoadingAdd(false);
    }
  };

  const deleteEditor = async (user_id) => {
    setIsLoadingRemove(user_id);
    try {
      await api.auth.deleteEditor(user_id);
      const filtred = data.filter((data) => data.editor.user_id !== user_id);
      setData(filtred);
    } catch (e) {
      setError(e.response.data);
    }
    setIsLoadingRemove(false);
  };

  return (
    <div className="item block item_right" style={{ marginTop: "0px" }}>
      <div className="item__title"> Редакторы </div>
      <div className="item__descr">
        Все пользователи, добавленные в этот список, могут управлять вашими
        эмоциями и значками подписчика на BetterWASD.
      </div>
      <div className="item__border"></div>

      <div>
        <div className="bonuses__icons">
          {data.map((editor, index) => (
            <EditorUser
              key={index}
              user={editor}
              loading={isLoading}
              deleteEditor={deleteEditor}
              isLoadingRemove={isLoadingRemove}
            />
          ))}
        </div>

        <br></br>

        {error && <label className="error">{error.message}</label>}
        {isFocus ? (
          <div ovg="" className="wasd-input-wrapper">
            <div ovg="" className="wasd-input">
              {isLoadingAdd && (
                <Loading
                  style={{
                    position: "absolute",
                    zIndex: "5",
                    width: "205px",
                    height: "32px",
                  }}
                />
              )}
              <input
                autoFocus
                style={{ width: "205px", margin: "0" }}
                ovg=""
                onKeyDown={handler}
                placeholder="Имя пользователя"
              />
            </div>
          </div>
        ) : (
          <div className="flat-btn ovg" style={{ display: "flex" }}>
            <button
              onClick={() => {
                setIsFocus(true);
                setError(null);
              }}
              className={classnames("primary", "medium", "ovg")}
            >
              Добавить пользователя
            </button>
          </div>
        )}
      </div>

      <br></br>
      <br></br>

      {auth.user.channel_editor.length !== 0 && (
        <div>
          <div className="item__title">
            Пользователи, которыми вы управляете как редактор
          </div>
          <div className="item__descr">
            Вы можете управлять эмодзи для любого из перечисленных ниже
            пользователей.
          </div>
          <div className="item__border"></div>

          <div>
            <div className="bonuses__icons">
              {auth.user.channel_editor.map((editor, index) => (
                <EditorUser
                  key={index}
                  user={editor}
                  loading={isLoading}
                  deleteEditor={deleteEditor}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardEditor;
