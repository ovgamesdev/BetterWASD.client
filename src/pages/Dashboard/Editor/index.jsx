import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import EditorUser from "../../../components/UI/EditorUser";
import Loading from "../../../components/UI/Loading";

import api from "../../../services/api/index.js";
import useAuth from "../../../hooks/useAuth";
import useMeta from "../../../hooks/useMeta/index.tsx";

import "./../../user.css";

const DashboardEditor = () => {
  useMeta({ title: "BetterWASYA | Редакторы" });
  const auth = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [editors, setEditors] = useState(Array(2).fill({}));
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.auth.getEditors();
        setEditors(data);
      } catch (e) {
        setEditors([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (typeof auth.editor?.user_id !== "undefined") return navigate("/dashboard/emotes");

    fetchData();
  }, [auth.editor?.user_id, navigate]);

  const handler = async (e) => {
    if (e.key === "Enter") {
      setIsLoadingAdd(true);
      try {
        const { data } = await api.auth.addEditor({ user_login: e.target.value.trim() });
        setEditors([...editors, data]);
        toast.success("Пользователь добавлен в качестве редактора");
      } catch (e) {
        toast.error("Ошибка добавления редактора");
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
      const filtred = editors.filter((v) => v.editor.user_id !== user_id);
      setEditors(filtred);
      toast.success("Пользователь удален!");
    } catch (e) {
      toast.error("Ошибка удаления редактора");
    }
    setIsLoadingRemove(false);
  };

  return (
    <div className="item block item_right" style={{ marginTop: "0px" }}>
      <div className="item__title"> Редакторы </div>
      <div className="item__descr">
        Все пользователи, добавленные в этот список, могут управлять вашими эмоциями и значками подписчика на BetterWASYA.
      </div>
      <div className="item__border"></div>

      <div>
        <div className="bonuses__icons">
          {editors.map((editor, index) => (
            <EditorUser key={index} user={editor} loading={isLoading} deleteEditor={deleteEditor} isLoadingRemove={isLoadingRemove} />
          ))}
        </div>

        <br></br>

        {isFocus ? (
          <div className="wasd-input-wrapper">
            <div className="wasd-input">
              {isLoadingAdd && <Loading style={{ position: "absolute", zIndex: "5", width: "205px", height: "32px" }} />}
              <input autoFocus style={{ width: "205px", height: "34px", margin: "0" }} onKeyDown={handler} placeholder="Имя пользователя" />
            </div>
          </div>
        ) : (
          <div className="flat-btn" style={{ display: "flex" }}>
            <button
              onClick={() => {
                setIsFocus(true);
              }}
              className={`primary medium`}
              style={{ width: "205px", height: "34px" }}
            >
              Добавить пользователя
            </button>
          </div>
        )}
      </div>

      <br></br>
      <br></br>

      {auth.user.channel_editor.length !== 0 && (
        <>
          <div className="item__title"> Пользователи, которыми вы управляете как редактор </div>
          <div className="item__descr"> Вы можете управлять эмодзи для любого из перечисленных ниже пользователей. </div>
          <div className="item__border"></div>

          <div>
            <div className="bonuses__icons">
              {auth.user.channel_editor.map((editor, index) => (
                <EditorUser key={index} user={editor} loading={isLoading} deleteEditor={deleteEditor} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardEditor;
