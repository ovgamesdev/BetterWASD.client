import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import EditorUser from "../../../components/UI/EditorUser";
import Loading from "../../../components/UI/Loading";
import Input from "../../../components/UI/Input";

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
  const [isLoadingAccess, setIsLoadingAccess] = useState(false);
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [editors, setEditors] = useState(Array(3).fill({}));
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
        global.gtag("event", "add_user_editor", { wasd_user_id: auth.user.user_id, user_login: auth.user.user_login, editor_user_id: data.editor.user_id });
      } catch (e) {
        toast.error("Ошибка добавления редактора");
      }

      e.target.value = "";
      setIsFocus(false);
      setIsLoadingAdd(false);
    }
  };

  const deleteEditor = async (user_id) => {
    if (!global.confirm("Вы уверены?")) return;
    setIsLoadingRemove(user_id);
    try {
      await api.auth.deleteEditor(user_id);
      const filtred = editors.filter((v) => v.editor.user_id !== user_id);
      setEditors(filtred);
      toast.success("Пользователь удален!");
      global.gtag("event", "delete_user_editor", { wasd_user_id: auth.user.user_id, user_login: auth.user.user_login, editor_user_id: user_id });
    } catch (e) {
      toast.error("Ошибка удаления редактора");
    } finally {
      setIsLoadingRemove(false);
    }
  };

  const updateAccess = async (editor_id, access) => {
    setIsLoadingAccess(true);
    try {
      await api.auth.updateEditorAccess(editor_id, access);
      toast.success("Доступ редактора изменен");
      // global.gtag("event", "update_editor_access", { wasd_user_id: auth.user.user_id, user_login: auth.user.user_login, editor_user_id: user_id, access: JSON.stringify(access) });
    } catch (e) {
      toast.error("Ошибка при изменении доступа редактора");
    } finally {
      setIsLoadingAccess(false);
    }
  };

  return (
    <div className="item block item_right" style={{ marginTop: "0px" }}>
      <div className="item__title"> Редакторы </div>
      <div className="item__descr">Все пользователи, добавленные в этот список, могут управлять вашими эмоциями, значками подписчика и оповещениями на BetterWASYA.</div>
      <div className="item__border" />

      <table className="paint__table">
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Права доступа</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {editors.map((editor, index) => (
            <EditorUser
              key={index}
              user={editor}
              loading={isLoading}
              deleteEditor={deleteEditor}
              updateAccess={updateAccess}
              isLoadingRemove={isLoadingRemove}
              isLoadingAccess={isLoadingAccess}
              setAccess={(access, id) => setEditors(editors.map((edit) => (edit._id === id ? { ...edit, access } : edit)))}
            />
          ))}
        </tbody>
      </table>

      <br />

      {isFocus ? (
        <Input autoFocus placeholder="Имя пользователя" inputStyle={{ width: "205px", height: "34px", margin: "0" }} onKeyDown={handler}>
          {isLoadingAdd && <Loading style={{ position: "absolute", zIndex: "5", width: "205px", height: "32px" }} />}
        </Input>
      ) : (
        <div className="flat-btn" style={{ display: "flex" }}>
          <button onClick={() => setIsFocus(true)} className="primary medium" style={{ width: "205px", height: "34px" }}>
            Добавить пользователя
          </button>
        </div>
      )}

      <br />
      <br />

      {auth.user.channel_editor.length !== 0 && (
        <>
          <div className="item__title"> Пользователи, которыми вы управляете как редактор </div>
          <div className="item__descr"> Вы можете управлять эмодзи для любого из перечисленных ниже пользователей. </div>
          <div className="item__border" />

          <div className="bonuses__icons">
            <table className="paint__table">
              <tbody>
                {auth.user.channel_editor.map((editor, index) => (
                  <EditorUser key={index} user={editor} loading={isLoading} deleteEditor={deleteEditor} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardEditor;
