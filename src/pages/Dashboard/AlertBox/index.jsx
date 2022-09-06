import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import TabGroup from "../../../components/UI/TabGroupV2";
import Loading from "../../../components/UI/Loading/Button";
import ButtonLoading from "../../../components/UI/Loading";
import Select from "../../../components/UI/Select";
import Input from "../../../components/UI/Input";

import useMeta from "../../../hooks/useMeta/index.tsx";
import useAuth from "../../../hooks/useAuth";
import api from "../../../services/api/index.js";

import General from "./General";
import Follows from "./Follows";
import Subscriptions from "./Subscriptions";
import PaidMessage from "./PaidMessage";
import Raids from "./Raids";

import "./options.scss";
import isEqual from "../../../lib/isEqual";

const colourOptions = [
  { label: "Подписка", value: "subscriptions" },
  { label: "Переподписка", value: "resubs" },
  { label: "Фоллоу", value: "follows" },
  { label: "Платное сообщение", value: "paid_message" },
  { label: "Рейд", value: "raids" },
];
const tabOptions = [
  { label: "Основные настройки", value: "general" },
  { label: "Фоллоу", value: "follows" },
  { label: "Подписка", value: "subscriptions" },
  { label: "Платное сообщение", value: "paid_message" },
  { label: "Рейд", value: "raids" },
];
const optionsToSearch = (options) => options.map((option, i) => `${i === 0 ? "?" : "&"}${option.value}=1`).join("");

const DashboardAlertBox = () => {
  const auth = useAuth();
  useMeta({ title: "BetterWASYA | Оповещения" });
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingTest, setIsLoadingTest] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [filters, setFilters] = useState(colourOptions);

  const [settings, setSettings] = useState(null);
  const [defaultSettings, setDefaultSettings] = useState(null);
  const [widgetUrl, setWidgetUrl] = useState(null);

  const [isFilterEdited, setFilterEdited] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: jdata } = await api.auth.getAlertSettings(auth.editor?.user_id);
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
      await api.auth.editAlertSettings(settings, auth.editor?.user_id);
      toast.success("Оповещения сохранены!");
      setDefaultSettings(settings);
    } catch (e) {
      if (e.response?.data?.code === "NOT_ACCESS") {
        toast.error("Нет доступа");
      } else {
        toast.error("Ошибка сохранения оповещений");
      }
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const createEvent = {
    Follow: async () => {
      try {
        setIsLoadingTest("Follow");
        await api.alertBox.testFollow(auth.editor?.user_id);
        toast("Оповещение отправлено!");
      } catch (e) {
        if (e.response?.data?.code === "NOT_ACCESS") {
          toast.error("Нет доступа");
        } else {
          toast.error("Ошибка отправки уведомления");
        }
      } finally {
        setIsLoadingTest(false);
      }
    },
    Sub: async () => {
      try {
        setIsLoadingTest("Sub");
        await api.alertBox.testSub(auth.editor?.user_id);
        toast("Оповещение отправлено!");
      } catch (e) {
        if (e.response?.data?.code === "NOT_ACCESS") {
          toast.error("Нет доступа");
        } else {
          toast.error("Ошибка отправки уведомления");
        }
      } finally {
        setIsLoadingTest(false);
      }
    },
    PaidMessage: async () => {
      try {
        setIsLoadingTest("PaidMessage");
        await api.alertBox.testPaidMessage(auth.editor?.user_id);
        toast("Оповещение отправлено!");
      } catch (e) {
        if (e.response?.data?.code === "NOT_ACCESS") {
          toast.error("Нет доступа");
        } else {
          toast.error("Ошибка отправки уведомления");
        }
      } finally {
        setIsLoadingTest(false);
      }
    },
    Raid: async () => {
      try {
        setIsLoadingTest("Raid");
        await api.alertBox.testRaid(auth.editor?.user_id);
        toast("Оповещение отправлено!");
      } catch (e) {
        if (e.response?.data?.code === "NOT_ACCESS") {
          toast.error("Нет доступа");
        } else {
          toast.error("Ошибка отправки уведомления");
        }
      } finally {
        setIsLoadingTest(false);
      }
    },
  };

  return (
    <div className="item block item_right" style={{ marginTop: "0px" }}>
      <div className="item__title"> Оповещения </div>
      <div className="item__descr">Порадуйте ваших зрителей с помощью красивых оповещений на стриме.</div>
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
                      navigator.clipboard.writeText(`${widgetUrl}${isFilterEdited ? optionsToSearch(filters) : ""}`);
                      toast("Ссылка на виджет скопирована!");
                    }}
                  >
                    <div className="copy-input">Cкопировать URL-адрес виджета</div>
                  </Input>

                  <div style={{ width: "300px", marginLeft: "5px" }}>
                    <Select
                      isMulti={true}
                      defaultValue={filters}
                      options={colourOptions}
                      onChange={(value) => {
                        setFilters(value);
                        setFilterEdited(true);
                      }}
                      title="Фильтр событий"
                    />
                  </div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: "14px" }}>Используйте приведенный выше URL-адрес в OBS Studio или просто запустите его с помощью захвата окна.</p>
          </div>

          <p style={{ marginTop: "20px" }}>При открытом и работающем виджете, используйте кнопки ниже для показа тестовых оповещений.</p>
          <div className="flat-btn" style={{ display: "flex" }}>
            <button className="basic medium" disabled={true || isLoadingTest === "Follow"} onClick={() => createEvent.Follow()}>
              {isLoadingTest === "Follow" && <ButtonLoading />} Тест Фоллоу
            </button>
            <button className="basic medium" disabled={true || isLoadingTest === "Sub"} onClick={() => createEvent.Sub()} style={{ margin: "0 5px" }}>
              {isLoadingTest === "Sub" && <ButtonLoading />} Тест Подписка
            </button>
            <button className="basic medium" disabled={true || isLoadingTest === "PaidMessage"} onClick={() => createEvent.PaidMessage()}>
              {isLoadingTest === "PaidMessage" && <ButtonLoading />} Тест Платное сообщение
            </button>
            <button className="basic medium" disabled={true || isLoadingTest === "Raid"} onClick={() => createEvent.Raid()} style={{ margin: "0 5px" }}>
              {isLoadingTest === "Raid" && <ButtonLoading />} Тест Рейд
            </button>
          </div>

          <TabGroup
            style={{ marginTop: "25px", marginBottom: "10px" }}
            active={location.hash.split("#").join("")}
            defaultValue="general"
            onChange={(e) => {
              setActiveTab(e.value);
              navigate("#" + e.value);
            }}
            tabs={tabOptions}
          />
          <div className="item__border" />

          {activeTab === "general" && <General settings={settings} setSettings={setSettings} />}
          {activeTab === "follows" && <Follows settings={settings} setSettings={setSettings} />}
          {activeTab === "subscriptions" && <Subscriptions settings={settings} setSettings={setSettings} />}
          {activeTab === "raids" && <Raids settings={settings} setSettings={setSettings} />}
          {activeTab === "paid_message" && <PaidMessage settings={settings} setSettings={setSettings} />}

          <div className="item__border" />
          <div className="flat-btn" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button onClick={onSave} disabled={isLoadingUpdate || isEqual(defaultSettings, settings)} className="primary medium" style={{ width: "300px" }}>
              {isLoadingUpdate ? <ButtonLoading /> : "Сохранить"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardAlertBox;
