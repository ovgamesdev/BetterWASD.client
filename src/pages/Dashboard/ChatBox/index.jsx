import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Loading from "../../../components/UI/Loading/Button";
import ButtonLoading from "../../../components/UI/Loading";
import Select from "../../../components/UI/Select";
import Input from "../../../components/UI/Input";

import useMeta from "../../../hooks/useMeta/index.tsx";
import useAuth from "../../../hooks/useAuth";
import api from "../../../services/api/index.js";

import General from "./General";

import "../../Dashboard/AlertBox/options.scss";
import isEqual from "../../../lib/isEqual";
import ChatPreview from "./ChatPreview";

const ChatBox = () => {
  const auth = useAuth();
  useMeta({ title: "BetterWASYA | Окно чата" });

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  const [settings, setSettings] = useState(null);
  const [defaultSettings, setDefaultSettings] = useState(null);
  const [widgetUrl, setWidgetUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: jdata } = await api.auth.getChatSettings(auth.editor?.user_id);
        setSettings(jdata.settings);
        setDefaultSettings(jdata.settings);
        setWidgetUrl(jdata.widget_url);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [auth.editor?.user_id]);

  const onSave = async () => {
    try {
      setIsLoadingUpdate(true);
      await api.auth.editChatSettings(settings, auth.editor?.user_id);
      toast.success("Настройки чата сохранены!");
      setDefaultSettings(settings);
    } catch (e) {
      if (e.response?.data?.code === "NOT_ACCESS") {
        toast.error("Нет доступа");
      } else {
        toast.error("Ошибка сохранения настроек");
      }
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  return (
    <div className="item block item_right" style={{ marginTop: "0px" }}>
      <div className="item__title"> Окно чата </div>
      <div className="item__descr">Включите чат вашего канала в свою трансляцию.</div>
      <div className="item__border" />

      {isLoading && <Loading />}
      {!isLoading && settings && (
        <>
          <div className="section__body">
            <div className="row">
              <div className="left">
                <label>Ссылка на виджет</label>
              </div>
              <div className="right">
                <div style={{ display: "flex" }}>
                  <Input
                    value={widgetUrl}
                    readOnly
                    inputClassName="blur"
                    inputStyle={{ cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(widgetUrl);
                      toast("Ссылка на виджет скопирована!");
                    }}
                  >
                    <div className="copy-input">Cкопировать URL-адрес виджета</div>
                  </Input>
                </div>
              </div>
            </div>
            <p style={{ fontSize: "14px" }}>Используйте приведенный выше URL-адрес в OBS Studio или просто запустите его с помощью захвата окна.</p>
          </div>

          <div className="item__border" />
          <ChatPreview settings={settings} streamer_id={auth.editor?.user_id || auth.user?.user_id} />
          <div className="item__border" />

          <General settings={settings} setSettings={setSettings} />

          <div className="item__border" />
          <div className="flat-btn" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button onClick={onSave} disabled={isLoadingUpdate || isEqual(defaultSettings, settings)} className="primary medium" style={{ width: "300px" }}>
              {isLoadingUpdate ? <ButtonLoading /> : "Сохранить"}
            </button>
            {!(isLoadingUpdate || isEqual(defaultSettings, settings)) && <span className="warning">Обновите виджет после его сохранения!</span>}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
