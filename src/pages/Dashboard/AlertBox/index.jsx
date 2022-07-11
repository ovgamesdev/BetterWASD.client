import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { toast } from "react-toastify";

import TabGroup from "../../../components/UI/TabGroupV2";
import Loading from "../../../components/UI/Loading/Button";
import ButtonLoading from "../../../components/UI/Loading";
import ColorPicker from "../../../components/UI/ColorPicker";
import Accordion from "../../../components/UI/Accordion";
import FilesGallery from "../../../components/UI/FilesGallery";
import Select from "../../../components/UI/Select";
import CreatableSelect from "../../../components/UI/Select/Creatable";
import Slider from "../../../components/UI/Slider";

import useMeta from "../../../hooks/useMeta/index.tsx";
import useAuth from "../../../hooks/useAuth";
import api from "../../../services/api/index.js";

import "./options.scss";
import fonts from "./fonts.json";
import animationAlertShow from "./animation-alert-show.json";
import animationAlertHide from "./animation-alert-hide.json";
import animationText from "./animation-text.json";

const colourOptions = [
  { label: "Подписка", value: "subscriptions" },
  { label: "Переподписка", value: "resubs" },
  { label: "Фоллоу", value: "follows" },
  { label: "Рейд", value: "raids" },
];
const tabOptions = [
  { label: "Основные настройки", value: "general" },
  { label: "Фоллоу", value: "follows" },
  { label: "Подписка", value: "subscriptions" },
  { label: "Рейд", value: "raids" },
];
const fontOptions = fonts.map((v) => {
  return { label: v, value: v };
});

const optionsToSearch = (options) => options.map((option, i) => `${i === 0 ? "?" : "&"}${option.value}=1`).join("");

const DashboardAlertBox = () => {
  useMeta({ title: "BetterWASYA | Оповещения" });
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingTest, setIsLoadingTest] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [filters, setFilters] = useState(colourOptions);

  const [settings, setSettings] = useState(null);
  const [widgetUrl, setWidgetUrl] = useState(null);

  const [isFilterEdited, setFilterEdited] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: jdata } = await api.auth.getAlertSettings();
        setSettings(jdata.settings);
        setWidgetUrl(jdata.widget_url);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (typeof auth.editor?.user_id !== "undefined") return navigate("/dashboard/emotes");

    fetchData();
  }, [auth.editor?.user_id, navigate]);

  const onSave = async () => {
    try {
      setIsLoadingUpdate(true);
      await api.auth.editAlertSettings(settings);
      toast.success("Оповещения сохранены!");
    } catch (err) {
      toast.error("Ошибка сохранения оповещений");
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const createEvent = {
    Follow: async () => {
      try {
        setIsLoadingTest("Follow");
        await api.alertBox.testFollow();
        toast("Оповещение отправлено!");
      } catch {
        toast.error("Ошибка отправки уведомления");
      } finally {
        setIsLoadingTest(false);
      }
    },
    Sub: async () => {
      try {
        setIsLoadingTest("Sub");
        await api.alertBox.testSub();
        toast("Оповещение отправлено!");
      } catch {
        toast.error("Ошибка отправки уведомления");
      } finally {
        setIsLoadingTest(false);
      }
    },
    Raid: async () => {
      try {
        setIsLoadingTest("Raid");
        await api.alertBox.testRaid();
        toast("Оповещение отправлено!");
      } catch {
        toast.error("Ошибка отправки уведомления");
      } finally {
        setIsLoadingTest(false);
      }
    },
  };

  return (
    <div className="item block item_right" style={{ marginTop: "0px" }}>
      <div className="item__title"> Оповещения </div>
      <div className="item__descr">Порадуйте ваших зрителей с помощью красивых оповещений на стриме.</div>
      <div className="item__border"></div>

      {isLoading ? <Loading /> : null}
      {!isLoading && settings && (
        <>
          <div className="section__body">
            <div className="row">
              <div className="left">
                <label>Ссылка на виджет</label>
              </div>
              <div className="right">
                <div style={{ display: "flex" }}>
                  <div className="wasd-input-wrapper">
                    <div
                      className="wasd-input"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        navigator.clipboard.writeText(`${widgetUrl}${isFilterEdited ? optionsToSearch(filters) : ""}`);
                        toast("Ссылка на виджет скопирована!");
                      }}
                    >
                      <input style={{ margin: 0 }} className="blur" value={widgetUrl} readOnly />
                      <div className="copy-input">Cкопировать URL-адрес виджета</div>
                    </div>
                  </div>
                  <div style={{ width: "300px", marginLeft: "5px" }}>
                    <Select
                      isMulti={true}
                      defaultValue={filters}
                      options={colourOptions}
                      onChange={(value) => {
                        setFilters(value);
                        setFilterEdited(true);
                      }}
                      title={"Фильтр событий"}
                    />
                  </div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: "14px" }}>
              Используйте приведенный выше URL-адрес в OBS Studio или просто запустите его с помощью захвата окна.
            </p>
          </div>

          <p style={{ marginTop: "20px" }}>При открытом и работающем виджете, используйте кнопки ниже для показа тестовых оповещений.</p>
          <div className="flat-btn" style={{ display: "flex" }}>
            <button className="basic medium" disabled={isLoadingTest === "Follow"} onClick={() => createEvent.Follow()}>
              {isLoadingTest === "Follow" && <ButtonLoading />} Тест Фоллоу
            </button>
            <button
              className="basic medium"
              disabled={isLoadingTest === "Sub"}
              onClick={() => createEvent.Sub()}
              style={{ margin: "0 5px" }}
            >
              {isLoadingTest === "Sub" && <ButtonLoading />} Тест Подписка
            </button>
            <button className="basic medium" disabled={isLoadingTest === "Raid"} onClick={() => createEvent.Raid()}>
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
          <div className="item__border"></div>

          {activeTab === "general" && (
            <>
              <div className="row">
                <div className="left">
                  <label>Цвет фона</label>
                </div>
                <div className="right">
                  <ColorPicker
                    value={settings.background_color}
                    onChange={(color) => setSettings({ ...settings, background_color: color })}
                  />
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Задержка оповещений</label>
                </div>
                <div className="right">
                  <Slider
                    min={0}
                    max={30000}
                    step={1000}
                    value={settings.alert_delay}
                    onChange={(changeEvent) => setSettings({ ...settings, alert_delay: Number(changeEvent.target.value) })}
                    tooltipLabel={(v) => v / 1000 + "сек"}
                  />
                </div>
              </div>
              <div className="row" style={{ display: "flex" }}>
                <div className="left">
                  <label>Парирование оповещений</label>
                </div>
                <div className="right" style={{ display: "flex" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={settings.interrupt_mode}
                      onChange={(changeEvent) => setSettings({ ...settings, interrupt_mode: changeEvent.target.checked })}
                      id="interrupt_mode"
                    />
                    <label htmlFor="interrupt_mode" style={{ marginLeft: "8px", fontSize: "12px", opacity: ".8", cursor: "pointer" }}>
                      Новое оповещение будет прерывать оповещение, отображаемое на экране
                    </label>
                  </div>
                </div>
              </div>
              {settings.interrupt_mode && (
                <div className="row">
                  <div className="left">
                    <label>Задержка парирования</label>
                  </div>
                  <div className="right">
                    <Slider
                      min={500}
                      max={20000}
                      step={500}
                      value={settings.interrupt_mode_delay}
                      onChange={(changeEvent) => setSettings({ ...settings, interrupt_mode_delay: Number(changeEvent.target.value) })}
                      tooltipLabel={(v) => v / 1000 + "сек"}
                    />
                  </div>
                </div>
              )}
            </>
          )}
          {activeTab === "follows" && (
            <>
              <div className="row">
                <div className="left">
                  <label>Расположение</label>
                </div>
                <div className="right">
                  <Select
                    defaultValue={{ value: settings.follow_layout }}
                    onChange={(value) => setSettings({ ...settings, follow_layout: value.value })}
                    options={[
                      { label: "вверху", value: "above" },
                      { label: "баннер", value: "banner" },
                      { label: "боковая", value: "side" },
                    ]}
                  />
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Анимация оповещения</label>
                </div>
                <div className="right">
                  <div className="split">
                    <Select
                      defaultValue={{ value: settings.follow_show_animation }}
                      onChange={(value) => setSettings({ ...settings, follow_show_animation: value.value })}
                      options={animationAlertShow}
                    />
                    <Select
                      defaultValue={{ value: settings.follow_hide_animation }}
                      onChange={(value) => setSettings({ ...settings, follow_hide_animation: value.value })}
                      options={animationAlertHide}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Шаблон сообщения</label>
                </div>
                <div className="right">
                  <div style={{ display: "flex" }}>
                    <div className="wasd-input-wrapper">
                      <div className="wasd-input">
                        <input
                          style={{ margin: 0 }}
                          value={settings.follow_message_template}
                          placeholder="используйте {name} чтобы заменить его на имя фолловера"
                          onChange={(e) => setSettings({ ...settings, follow_message_template: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="tooltip_wrapper" data-tip="{name} - Имя фолловера">
                      ?
                    </div>

                    <ReactTooltip />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Анимация текста</label>
                </div>
                <div className="right">
                  <div className="split">
                    <Select
                      defaultValue={{ value: settings.follow_text_animation }}
                      onChange={(value) => setSettings({ ...settings, follow_text_animation: value.value })}
                      options={animationText}
                    />
                    <div
                      style={{
                        font: '600 16px "Open Sans"',
                        textTransform: "uppercase",
                      }}
                      className="preview"
                    >
                      {"Sample Text".split("").map((w, i) => (
                        <span key={i} className={"animated-letter " + settings.follow_text_animation}>
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Изображение</label>
                </div>
                <div className="right">
                  <FilesGallery
                    value={settings.follow_image_metadata}
                    title="Галерея изображений"
                    title_link="Ссылка на изображение"
                    fileType="images"
                    fileAccept=".jpg,.png,.gif,.jpeg,.svg,.webm,.mp4"
                    onChange={(value) => setSettings({ ...settings, follow_image: value.raw, follow_image_metadata: value.metadata })}
                  />
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Звук</label>
                </div>
                <div className="right">
                  <FilesGallery
                    value={settings.follow_sound_metadata}
                    title="Галерея звуков"
                    title_link="Ссылка на аудио"
                    fileType="sounds"
                    fileAccept=".mp3,.wav,.ogg"
                    onChange={(value) => setSettings({ ...settings, follow_sound: value.raw, follow_sound_metadata: value.metadata })}
                    sound_volume={settings.follow_sound_volume}
                  />
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Громкость звука</label>
                </div>
                <div className="right">
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={settings.follow_sound_volume}
                    onChange={(changeEvent) => setSettings({ ...settings, follow_sound_volume: Number(changeEvent.target.value) })}
                    tooltipLabel={(v) => v + "%"}
                  />
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Длительность оповещения</label>
                </div>
                <div className="right">
                  <Slider
                    min={2000}
                    max={300000}
                    step={1000}
                    value={settings.follow_alert_duration}
                    onChange={(changeEvent) => setSettings({ ...settings, follow_alert_duration: Number(changeEvent.target.value) })}
                    tooltipLabel={(v) => v / 1000 + "сек"}
                  />
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Задержка текста оповещения</label>
                </div>
                <div className="right">
                  <Slider
                    min={0}
                    max={60000}
                    step={1000}
                    value={settings.follow_text_delay}
                    onChange={(changeEvent) => setSettings({ ...settings, follow_text_delay: Number(changeEvent.target.value) })}
                    tooltipLabel={(v) => v / 1000 + "сек"}
                  />
                </div>
              </div>

              <Accordion title_open="Открыть настройки шрифта" title_close="Закрыть настройки шрифта">
                <div className="row">
                  <div className="left">
                    <label>Шрифт</label>
                  </div>
                  <div className="right">
                    <CreatableSelect
                      defaultValue={{ value: settings.follow_font }}
                      onChange={(value) => setSettings({ ...settings, follow_font: value.value })}
                      options={fontOptions}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Размер шрифта</label>
                  </div>
                  <div className="right">
                    <Slider
                      min={12}
                      max={80}
                      step={2}
                      value={Number(settings.follow_font_size?.replace("px", ""))}
                      onChange={(changeEvent) => setSettings({ ...settings, follow_font_size: changeEvent.target.value + "px" })}
                      tooltipLabel={(v) => v + "px"}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Плотность шрифта</label>
                  </div>
                  <div className="right">
                    <Slider
                      min={300}
                      max={900}
                      step={100}
                      value={Number(settings.follow_font_weight)}
                      onChange={(changeEvent) => setSettings({ ...settings, follow_font_weight: changeEvent.target.value.toString() })}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Цвет текста</label>
                  </div>
                  <div className="right">
                    <ColorPicker
                      value={settings.follow_font_color}
                      onChange={(color) => setSettings({ ...settings, follow_font_color: color })}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Цвет выделения текста</label>
                  </div>
                  <div className="right">
                    <ColorPicker
                      value={settings.follow_font_color2}
                      onChange={(color) => setSettings({ ...settings, follow_font_color2: color })}
                    />
                  </div>
                </div>
              </Accordion>
            </>
          )}
          {activeTab === "subscriptions" && (
            <>
              <div className="row">
                <div className="left">
                  <label>Расположение</label>
                </div>
                <div className="right">
                  <Select
                    defaultValue={{ value: settings.sub_layout }}
                    onChange={(value) => setSettings({ ...settings, sub_layout: value.value })}
                    options={[
                      { label: "вверху", value: "above" },
                      { label: "баннер", value: "banner" },
                      { label: "боковая", value: "side" },
                    ]}
                  />
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Анимация оповещения</label>
                </div>
                <div className="right">
                  <div className="split">
                    <Select
                      defaultValue={{ value: settings.sub_show_animation }}
                      onChange={(value) => setSettings({ ...settings, sub_show_animation: value.value })}
                      options={animationAlertShow}
                    />
                    <Select
                      defaultValue={{ value: settings.sub_hide_animation }}
                      onChange={(value) => setSettings({ ...settings, sub_hide_animation: value.value })}
                      options={animationAlertHide}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Шаблон сообщения</label>
                </div>
                <div className="right">
                  <div style={{ display: "flex" }}>
                    <div className="wasd-input-wrapper">
                      <div className="wasd-input">
                        <input
                          style={{ margin: 0 }}
                          value={settings.sub_message_template}
                          placeholder="используйте {name} чтобы заменить его на имя подписчика"
                          onChange={(e) => setSettings({ ...settings, sub_message_template: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="tooltip_wrapper" data-tip="{name} - Имя подписчика">
                      ?
                    </div>

                    <ReactTooltip />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Анимация текста</label>
                </div>
                <div className="right">
                  <div className="split">
                    <Select
                      defaultValue={{ value: settings.sub_text_animation }}
                      onChange={(value) => setSettings({ ...settings, sub_text_animation: value.value })}
                      options={animationText}
                    />
                    <div
                      style={{
                        font: '600 16px "Open Sans"',
                        textTransform: "uppercase",
                      }}
                      className="preview"
                    >
                      {"Sample Text".split("").map((w, i) => (
                        <span key={i} className={"animated-letter " + settings.sub_text_animation}>
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Изображение</label>
                </div>
                <div className="right">
                  <FilesGallery
                    value={settings.sub_image_metadata}
                    title="Галерея изображений"
                    title_link="Ссылка на изображение"
                    fileType="images"
                    fileAccept=".jpg,.png,.gif,.jpeg,.svg,.webm,.mp4"
                    onChange={(value) => setSettings({ ...settings, sub_image: value.raw, sub_image_metadata: value.metadata })}
                  />
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Звук</label>
                </div>
                <div className="right">
                  <FilesGallery
                    value={settings.sub_sound_metadata}
                    title="Галерея звуков"
                    title_link="Ссылка на аудио"
                    fileType="sounds"
                    fileAccept=".mp3,.wav,.ogg"
                    onChange={(value) => setSettings({ ...settings, sub_sound: value.raw, sub_sound_metadata: value.metadata })}
                    sound_volume={settings.sub_sound_volume}
                  />
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Громкость звука</label>
                </div>
                <div className="right">
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={settings.sub_sound_volume}
                    onChange={(changeEvent) => setSettings({ ...settings, sub_sound_volume: Number(changeEvent.target.value) })}
                    tooltipLabel={(v) => v + "%"}
                  />
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Длительность оповещения</label>
                </div>
                <div className="right">
                  <Slider
                    min={2000}
                    max={300000}
                    step={1000}
                    value={settings.sub_alert_duration}
                    onChange={(changeEvent) => setSettings({ ...settings, sub_alert_duration: Number(changeEvent.target.value) })}
                    tooltipLabel={(v) => v / 1000 + "сек"}
                  />
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Задержка текста оповещения</label>
                </div>
                <div className="right">
                  <Slider
                    min={0}
                    max={60000}
                    step={1000}
                    value={settings.sub_text_delay}
                    onChange={(changeEvent) => setSettings({ ...settings, sub_text_delay: Number(changeEvent.target.value) })}
                    tooltipLabel={(v) => v / 1000 + "сек"}
                  />
                </div>
              </div>

              <Accordion title_open="Открыть настройки шрифта" title_close="Закрыть настройки шрифта">
                <div className="row">
                  <div className="left">
                    <label>Шрифт</label>
                  </div>
                  <div className="right">
                    <CreatableSelect
                      defaultValue={{ value: settings.sub_font }}
                      onChange={(value) => setSettings({ ...settings, sub_font: value.value })}
                      options={fontOptions}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Размер шрифта</label>
                  </div>
                  <div className="right">
                    <Slider
                      min={12}
                      max={80}
                      step={2}
                      value={Number(settings.sub_font_size?.replace("px", ""))}
                      onChange={(changeEvent) => setSettings({ ...settings, sub_font_size: changeEvent.target.value + "px" })}
                      tooltipLabel={(v) => v + "px"}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Плотность шрифта</label>
                  </div>
                  <div className="right">
                    <Slider
                      min={300}
                      max={900}
                      step={100}
                      value={Number(settings.sub_font_weight)}
                      onChange={(changeEvent) => setSettings({ ...settings, sub_font_weight: changeEvent.target.value.toString() })}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Цвет текста</label>
                  </div>
                  <div className="right">
                    <ColorPicker
                      value={settings.sub_font_color}
                      onChange={(color) => setSettings({ ...settings, sub_font_color: color })}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Цвет выделения текста</label>
                  </div>
                  <div className="right">
                    <ColorPicker
                      value={settings.sub_font_color2}
                      onChange={(color) => setSettings({ ...settings, sub_font_color2: color })}
                    />
                  </div>
                </div>
              </Accordion>
            </>
          )}
          {activeTab === "raids" && (
            <>
              <div className="row">
                <div className="left">
                  <label>Расположение</label>
                </div>
                <div className="right">
                  <Select
                    defaultValue={{ value: settings.raid_layout }}
                    onChange={(value) => setSettings({ ...settings, raid_layout: value.value })}
                    options={[
                      { label: "вверху", value: "above" },
                      { label: "баннер", value: "banner" },
                      { label: "боковая", value: "side" },
                    ]}
                  />
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Анимация оповещения</label>
                </div>
                <div className="right">
                  <div className="split">
                    <Select
                      defaultValue={{ value: settings.raid_show_animation }}
                      onChange={(value) => setSettings({ ...settings, raid_show_animation: value.value })}
                      options={animationAlertShow}
                    />
                    <Select
                      defaultValue={{ value: settings.raid_hide_animation }}
                      onChange={(value) => setSettings({ ...settings, raid_hide_animation: value.value })}
                      options={animationAlertHide}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Шаблон сообщения</label>
                </div>
                <div className="right">
                  <div style={{ display: "flex" }}>
                    <div className="wasd-input-wrapper">
                      <div className="wasd-input">
                        <input
                          style={{ margin: 0 }}
                          value={settings.raid_message_template}
                          placeholder="используйте {name} чтобы заменить его на имя рейдера"
                          onChange={(e) => setSettings({ ...settings, raid_message_template: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="tooltip_wrapper" data-tip="{name} - Имя рейдера">
                      ?
                    </div>

                    <ReactTooltip />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Анимация текста</label>
                </div>
                <div className="right">
                  <div className="split">
                    <Select
                      defaultValue={{ value: settings.raid_text_animation }}
                      onChange={(value) => setSettings({ ...settings, raid_text_animation: value.value })}
                      options={animationText}
                    />
                    <div
                      style={{
                        font: '600 16px "Open Sans"',
                        textTransform: "uppercase",
                      }}
                      className="preview"
                    >
                      {"Sample Text".split("").map((w, i) => (
                        <span key={i} className={"animated-letter " + settings.raid_text_animation}>
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Изображение</label>
                </div>
                <div className="right">
                  <FilesGallery
                    value={settings.raid_image_metadata}
                    title="Галерея изображений"
                    title_link="Ссылка на изображение"
                    fileType="images"
                    fileAccept=".jpg,.png,.gif,.jpeg,.svg,.webm,.mp4"
                    onChange={(value) => setSettings({ ...settings, raid_image: value.raw, raid_image_metadata: value.metadata })}
                  />
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Звук</label>
                </div>
                <div className="right">
                  <FilesGallery
                    value={settings.raid_sound_metadata}
                    title="Галерея звуков"
                    title_link="Ссылка на аудио"
                    fileType="sounds"
                    fileAccept=".mp3,.wav,.ogg"
                    onChange={(value) => setSettings({ ...settings, raid_sound: value.raw, raid_sound_metadata: value.metadata })}
                    sound_volume={settings.raid_sound_volume}
                  />
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Громкость звука</label>
                </div>
                <div className="right">
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={settings.raid_sound_volume}
                    onChange={(changeEvent) => setSettings({ ...settings, raid_sound_volume: Number(changeEvent.target.value) })}
                    tooltipLabel={(v) => v + "%"}
                  />
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Длительность оповещения</label>
                </div>
                <div className="right">
                  <Slider
                    min={2000}
                    max={300000}
                    step={1000}
                    value={settings.raid_alert_duration}
                    onChange={(changeEvent) => setSettings({ ...settings, raid_alert_duration: Number(changeEvent.target.value) })}
                    tooltipLabel={(v) => v / 1000 + "сек"}
                  />
                </div>
              </div>
              <div className="row">
                <div className="left">
                  <label>Задержка текста оповещения</label>
                </div>
                <div className="right">
                  <Slider
                    min={0}
                    max={60000}
                    step={1000}
                    value={settings.raid_text_delay}
                    onChange={(changeEvent) => setSettings({ ...settings, raid_text_delay: Number(changeEvent.target.value) })}
                    tooltipLabel={(v) => v / 1000 + "сек"}
                  />
                </div>
              </div>

              <Accordion title_open="Открыть настройки шрифта" title_close="Закрыть настройки шрифта">
                <div className="row">
                  <div className="left">
                    <label>Шрифт</label>
                  </div>
                  <div className="right">
                    <CreatableSelect
                      defaultValue={{ value: settings.raid_font }}
                      onChange={(value) => setSettings({ ...settings, raid_font: value.value })}
                      options={fontOptions}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Размер шрифта</label>
                  </div>
                  <div className="right">
                    <Slider
                      min={12}
                      max={80}
                      step={2}
                      value={Number(settings.raid_font_size?.replace("px", ""))}
                      onChange={(changeEvent) => setSettings({ ...settings, raid_font_size: changeEvent.target.value + "px" })}
                      tooltipLabel={(v) => v + "px"}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Плотность шрифта</label>
                  </div>
                  <div className="right">
                    <Slider
                      min={300}
                      max={900}
                      step={100}
                      value={Number(settings.raid_font_weight)}
                      onChange={(changeEvent) => setSettings({ ...settings, raid_font_weight: changeEvent.target.value.toString() })}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Цвет текста</label>
                  </div>
                  <div className="right">
                    <ColorPicker
                      value={settings.raid_font_color}
                      onChange={(color) => setSettings({ ...settings, raid_font_color: color })}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Цвет выделения текста</label>
                  </div>
                  <div className="right">
                    <ColorPicker
                      value={settings.raid_font_color2}
                      onChange={(color) => setSettings({ ...settings, raid_font_color2: color })}
                    />
                  </div>
                </div>
              </Accordion>
            </>
          )}

          <div className="item__border"></div>
          <div className="flat-btn" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button onClick={onSave} disabled={isLoadingUpdate} className={`primary medium`} style={{ width: "300px" }}>
              {isLoadingUpdate ? <ButtonLoading /> : "Сохранить"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardAlertBox;
