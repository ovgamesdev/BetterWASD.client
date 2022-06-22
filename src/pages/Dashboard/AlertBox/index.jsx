import React, { useState, useEffect } from "react";

import useTitle from "../../../hooks/useTitle/index.tsx";
import api from "../../../services/api";
import useAuth from "../../../hooks/useAuth";

import Select from "react-select";
import TabGroup from "../../../components/UI/TabGroupV2";
import Loading from "../../../components/UI/Loading/Button";
import Option from "../../../components/UI/DropDown/Option";
import Control from "../../../components/UI/DropDown/Control";

import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import RangeSlider from "react-bootstrap-range-slider";
import ButtonLoading from "../../../components/UI/Loading";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "./options.scss";
import ReactTooltip from "react-tooltip";
import ColorPicker from "../../../components/UI/ColorPicker";

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

const animationAlertShow = [
  {
    label: "Fade In",
    options: [
      {
        label: "Fade In",
        value: "fadeIn",
      },
      {
        label: "Fade In Down",
        value: "fadeInDown",
      },
      {
        label: "Fade In Down Big",
        value: "fadeInDownBig",
      },
      {
        label: "Fade In Left",
        value: "fadeInLeft",
      },
      {
        label: "Fade In Left Big",
        value: "fadeInLeftBig",
      },
      {
        label: "Fade In Right",
        value: "fadeInRight",
      },
      {
        label: "Fade In Right Big",
        value: "fadeInRightBig",
      },
      {
        label: "Fade In Up",
        value: "fadeInUp",
      },
      {
        label: "Fade In Up Big",
        value: "fadeInUpBig",
      },
    ],
  },
  {
    label: "Zoom In",
    options: [
      {
        label: "Zoom In",
        value: "zoomIn",
      },
      {
        label: "Zoom In Down",
        value: "zoomInDown",
      },
      {
        label: "Zoom In Left",
        value: "zoomInLeft",
      },
      {
        label: "Zoom In Right",
        value: "zoomInRight",
      },
      {
        label: "Zoom In Up",
        value: "zoomInUp",
      },
    ],
  },
  {
    label: "Bounce In",
    options: [
      {
        label: "Bounce In",
        value: "bounceIn",
      },
      {
        label: "Bounce In Down",
        value: "bounceInDown",
      },
      {
        label: "Bounce In Left",
        value: "bounceInLeft",
      },
      {
        label: "Bounce In Right",
        value: "bounceInRight",
      },
      {
        label: "Bounce In Up",
        value: "bounceInUp",
      },
    ],
  },
  {
    label: "Slide In",
    options: [
      {
        label: "Slide In Down",
        value: "slideInDown",
      },
      {
        label: "Slide In Left",
        value: "slideInLeft",
      },
      {
        label: "Slide In Right",
        value: "slideInRight",
      },
      {
        label: "Slide In Up",
        value: "slideInUp",
      },
    ],
  },
  {
    label: "Flip In",
    options: [
      {
        label: "Flip In X",
        value: "flipInX",
      },
      {
        label: "Flip In Y",
        value: "flipInY",
      },
    ],
  },
  {
    label: "Rotate In",
    options: [
      {
        label: "Rotate In",
        value: "rotateIn",
      },
      {
        label: "Rotate In Down Left",
        value: "rotateInDownLeft",
      },
      {
        label: "Rotate In Down Right",
        value: "rotateInDownRight",
      },
      {
        label: "Rotate In Up Left",
        value: "rotateInUpLeft",
      },
      {
        label: "Rotate In Up Right",
        value: "rotateInUpRight",
      },
    ],
  },
  {
    label: "Specials",
    options: [
      {
        label: "Light Speed In",
        value: "lightSpeedIn",
      },
      {
        label: "Roll In",
        value: "rollIn",
      },
    ],
  },
];
const animationAlertHide = [
  {
    label: "Fade Out",
    options: [
      {
        label: "Fade Out",
        value: "fadeOut",
      },
      {
        label: "Fade Out Down",
        value: "fadeOutDown",
      },
      {
        label: "Fade Out Down Big",
        value: "fadeOutDownBig",
      },
      {
        label: "Fade Out Left",
        value: "fadeOutLeft",
      },
      {
        label: "Fade Out Left Big",
        value: "fadeOutLeftBig",
      },
      {
        label: "Fade Out Right",
        value: "fadeOutRight",
      },
      {
        label: "Fade Out Right Big",
        value: "fadeOutRightBig",
      },
      {
        label: "Fade Out Up",
        value: "fadeOutUp",
      },
      {
        label: "Fade Out Up Big",
        value: "fadeOutUpBig",
      },
    ],
  },
  {
    label: "Zoom Out",
    options: [
      {
        label: "Zoom Out",
        value: "zoomOut",
      },
      {
        label: "Zoom Out Down",
        value: "zoomOutDown",
      },
      {
        label: "Zoom Out Left",
        value: "zoomOutLeft",
      },
      {
        label: "Zoom Out Right",
        value: "zoomOutRight",
      },
      {
        label: "Zoom Out Up",
        value: "zoomOutUp",
      },
    ],
  },
  {
    label: "Bounce Out",
    options: [
      {
        label: "Bounce Out",
        value: "bounceOut",
      },
      {
        label: "Bounce Out Down",
        value: "bounceOutDown",
      },
      {
        label: "Bounce Out Left",
        value: "bounceOutLeft",
      },
      {
        label: "Bounce Out Right",
        value: "bounceOutRight",
      },
      {
        label: "Bounce Out Up",
        value: "bounceOutUp",
      },
    ],
  },
  {
    label: "Slide Out",
    options: [
      {
        label: "Slide Out Down",
        value: "slideOutDown",
      },
      {
        label: "Slide Out Left",
        value: "slideOutLeft",
      },
      {
        label: "Slide Out Right",
        value: "slideOutRight",
      },
      {
        label: "Slide Out Up",
        value: "slideOutUp",
      },
    ],
  },
  {
    label: "Flip Out",
    options: [
      {
        label: "Flip Out X",
        value: "flipOutX",
      },
      {
        label: "Flip Out Y",
        value: "flipOutY",
      },
    ],
  },
  {
    label: "Rotate Out",
    options: [
      {
        label: "Rotate Out",
        value: "rotateOut",
      },
      {
        label: "Rotate Out Down Left",
        value: "rotateOutDownLeft",
      },
      {
        label: "Rotate Out Down Right",
        value: "rotateOutDownRight",
      },
      {
        label: "Rotate Out Up Left",
        value: "rotateOutUpLeft",
      },
      {
        label: "Rotate Out Up Right",
        value: "rotateOutUpRight",
      },
    ],
  },
  {
    label: "Specials",
    options: [
      {
        label: "Light Speed Out",
        value: "lightSpeedOut",
      },
      {
        label: "Roll Out",
        value: "rollOut",
      },
    ],
  },
];

const animationText = [
  {
    label: "Нет",
    value: "",
  },
  {
    label: "Подпрыгивание",
    value: "bounce",
  },
  {
    label: "Пульс",
    value: "pulse",
  },
  {
    label: "Резиновая лента",
    value: "rubberBand",
  },
  {
    label: "Тада",
    value: "tada",
  },
  {
    label: "Волна",
    value: "wave",
  },
  {
    label: "Покачивание",
    value: "wiggle",
  },
  {
    label: "Колебание",
    value: "wobble",
  },
];

const customSelectStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "var(--wasd-color-switch)" : "var(--wasd-color-text-fourth)",
    backgroundColor: state.isSelected ? "rgba(var(--color-system-blue), 1)" : "var(--color-second-layer)",
  }),
  control: (provided) => ({
    ...provided,
    backgroundColor: "var(--color-second-layer)",
    borderColor: "var(--wasd-color-text-fourth)",
    fontSize: "14px",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: "1080",
    backgroundColor: "var(--color-second-layer)",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--wasd-color-switch)",
  }),
};

const customFilterStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "var(--wasd-color-switch)" : "var(--wasd-color-text-fourth)",
    backgroundColor: "var(--color-second-layer)",
  }),
  control: (provided) => ({
    ...provided,
    backgroundColor: "var(--color-second-layer)",
    borderColor: "var(--wasd-color-text-fourth)",
    fontSize: "14px",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: "1080",
    backgroundColor: "var(--color-second-layer)",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--wasd-color-switch)",
  }),
};

const findAlertShowOption = (value) => {
  let res = null;
  for (let group of animationAlertShow) {
    for (let option of group.options) {
      if (option.value === value) {
        res = option;
        break;
      }
    }
  }
  return res;
};
const findAlertHideOption = (value) => {
  let res = null;
  for (let group of animationAlertHide) {
    for (let option of group.options) {
      if (option.value === value) {
        res = option;
        break;
      }
    }
  }
  return res;
};

const findTextOption = (value) => animationText.find((o) => o.value === value);

const optionsToSearch = (options) => options.map((option, i) => `${i === 0 ? "?" : "&"}${option.value}=1`).join("");

const DashboardAlertBox = () => {
  useTitle("BetterWASYA | Оповещения");
  const auth = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [filters, setFilters] = useState(optionsToSearch(colourOptions));

  const [settings, setSettings] = useState(null);
  const [widgetUrl, setWidgetUrl] = useState(null);

  const [isPlayed, setIsPlayed] = useState(false);
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
      toast("Оповещения сохранены!");
    } catch (err) {
      console.log(err.response);
      toast.error(err.response.data.error);
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  return (
    <>
      <div className="item block item_right" style={{ marginTop: "0px", width: "69.6%" }}>
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
                    <div className="wasd-input-wrapper" ovg="">
                      <div
                        ovg=""
                        className="wasd-input"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          navigator.clipboard.writeText(`${widgetUrl}${isFilterEdited ? filters : ""}`);
                          toast("Ссылка на виджет скопирована!");
                        }}
                      >
                        <input ovg="" style={{ margin: 0 }} className="blur" value={widgetUrl + filters} readOnly />
                        <div className="copy-input">Cкопировать URL-адрес виджета</div>
                      </div>
                    </div>
                    <Select
                      styles={customFilterStyles}
                      options={colourOptions}
                      isMulti
                      closeMenuOnSelect={false}
                      isClearable={false}
                      hideSelectedOptions={false}
                      defaultValue={colourOptions}
                      components={{
                        Option,
                        Control,
                      }}
                      onChange={(value) => {
                        setFilters(optionsToSearch(value));
                        setFilterEdited(true);
                      }}
                      allowSelectAll={true}
                    />
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "14px" }}>
                Используйте приведенный выше URL-адрес в OBS Studio или просто запустите его с помощью захвата окна.
              </p>
            </div>
            <TabGroup
              style={{ marginTop: "25px", marginBottom: "10px" }}
              active={0}
              onChange={(e) => setActiveTab(e.value)}
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
                      onChange={(color) =>
                        setSettings({
                          ...settings,
                          background_color: color,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Задержка оповещений</label>
                  </div>
                  <div className="right">
                    <RangeSlider
                      min={0}
                      max={30000}
                      step={1000}
                      value={settings.alert_delay}
                      onChange={(changeEvent) =>
                        setSettings({
                          ...settings,
                          alert_delay: Number(changeEvent.target.value),
                        })
                      }
                      tooltipLabel={(v) => v / 1000 + "сек"}
                    />
                  </div>
                </div>
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
                      styles={customSelectStyles}
                      defaultValue={{
                        label: settings.follow_layout,
                        value: settings.follow_layout,
                      }}
                      isClearable={false}
                      isSearchable={false}
                      onChange={(value) =>
                        setSettings({
                          ...settings,
                          follow_layout: value.value,
                        })
                      }
                      options={[
                        {
                          label: "вверху",
                          value: "above",
                        },
                        {
                          label: "баннер",
                          value: "banner",
                        },
                        {
                          label: "боковая",
                          value: "side",
                        },
                      ]}
                      hideSelectedOptions={false}
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
                        styles={customSelectStyles}
                        defaultValue={findAlertShowOption(settings.follow_show_animation)}
                        isClearable={false}
                        isSearchable={false}
                        onChange={(value) =>
                          setSettings({
                            ...settings,
                            follow_show_animation: value.value,
                          })
                        }
                        options={animationAlertShow}
                        hideSelectedOptions={false}
                      />
                      <Select
                        styles={customSelectStyles}
                        defaultValue={findAlertHideOption(settings.follow_hide_animation)}
                        isClearable={false}
                        isSearchable={false}
                        onChange={(value) =>
                          setSettings({
                            ...settings,
                            follow_hide_animation: value.value,
                          })
                        }
                        options={animationAlertHide}
                        hideSelectedOptions={false}
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
                      <div className="wasd-input-wrapper" ovg="">
                        <div ovg="" className="wasd-input">
                          <input
                            ovg=""
                            style={{ margin: 0 }}
                            value={settings.follow_message_template}
                            placeholder="используйте {name} чтобы заменить его на имя фолловера"
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                follow_message_template: e.target.value,
                              })
                            }
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
                        styles={customSelectStyles}
                        defaultValue={findTextOption(settings.follow_text_animation)}
                        isClearable={false}
                        isSearchable={false}
                        onChange={(value) =>
                          setSettings({
                            ...settings,
                            follow_text_animation: value.value,
                          })
                        }
                        options={animationText}
                        hideSelectedOptions={false}
                      />
                      <div
                        style={{
                          font: '600 16px "Open Sans"',
                          textTransform: "uppercase",
                        }}
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
                    <div className="preview">
                      <div
                        className="img"
                        style={{
                          backgroundImage: `url(${settings.follow_image})`,
                        }}
                      ></div>
                      <div className="wasd-input-wrapper" ovg="">
                        <div ovg="" className="wasd-input">
                          <input
                            ovg=""
                            style={{ margin: 0 }}
                            value={settings.follow_image}
                            placeholder="https://example.com/image.gif"
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                follow_image: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Звук</label>
                  </div>
                  <div className="right">
                    <div className="preview">
                      <button
                        disabled={isPlayed}
                        onClick={() => {
                          if (isPlayed) return;
                          const audio = new Audio(settings.follow_sound);
                          audio.volume = settings.follow_sound_volume / 100;
                          setIsPlayed(true);
                          audio.play();
                          audio.onended = () => {
                            setIsPlayed(false);
                          };
                          audio.onerror = (e) => {
                            setIsPlayed(false);
                            toast.error("Мы не можем воспроизвести этот звук");
                          };
                        }}
                      >
                        play
                      </button>
                      <div className="wasd-input-wrapper" ovg="">
                        <div ovg="" className="wasd-input">
                          <input
                            ovg=""
                            style={{ margin: 0 }}
                            value={settings.follow_sound}
                            placeholder="https://example.com/sound.mp3"
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                follow_sound: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Громкость звука</label>
                  </div>
                  <div className="right">
                    <RangeSlider
                      min={0}
                      max={100}
                      step={1}
                      value={settings.follow_sound_volume}
                      onChange={(changeEvent) =>
                        setSettings({
                          ...settings,
                          follow_sound_volume: Number(changeEvent.target.value),
                        })
                      }
                      tooltipLabel={(v) => v + "%"}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Длительность оповещения</label>
                  </div>
                  <div className="right">
                    <RangeSlider
                      min={2000}
                      max={300000}
                      step={1000}
                      value={settings.follow_alert_duration}
                      onChange={(changeEvent) =>
                        setSettings({
                          ...settings,
                          follow_alert_duration: Number(changeEvent.target.value),
                        })
                      }
                      tooltipLabel={(v) => v / 1000 + "сек"}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Задержка текста оповещения</label>
                  </div>
                  <div className="right">
                    <RangeSlider
                      min={0}
                      max={60000}
                      step={1000}
                      value={settings.follow_text_delay}
                      onChange={(changeEvent) =>
                        setSettings({
                          ...settings,
                          follow_text_delay: Number(changeEvent.target.value),
                        })
                      }
                      tooltipLabel={(v) => v / 1000 + "сек"}
                    />
                  </div>
                </div>
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
                      styles={customSelectStyles}
                      defaultValue={{
                        label: settings.sub_layout,
                        value: settings.sub_layout,
                      }}
                      isClearable={false}
                      isSearchable={false}
                      onChange={(value) =>
                        setSettings({
                          ...settings,
                          sub_layout: value.value,
                        })
                      }
                      options={[
                        {
                          label: "вверху",
                          value: "above",
                        },
                        {
                          label: "баннер",
                          value: "banner",
                        },
                        {
                          label: "боковая",
                          value: "side",
                        },
                      ]}
                      hideSelectedOptions={false}
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
                        styles={customSelectStyles}
                        defaultValue={findAlertShowOption(settings.sub_show_animation)}
                        isClearable={false}
                        isSearchable={false}
                        onChange={(value) =>
                          setSettings({
                            ...settings,
                            sub_show_animation: value.value,
                          })
                        }
                        options={animationAlertShow}
                        hideSelectedOptions={false}
                      />
                      <Select
                        styles={customSelectStyles}
                        defaultValue={findAlertHideOption(settings.sub_hide_animation)}
                        isClearable={false}
                        isSearchable={false}
                        onChange={(value) =>
                          setSettings({
                            ...settings,
                            sub_hide_animation: value.value,
                          })
                        }
                        options={animationAlertHide}
                        hideSelectedOptions={false}
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
                      <div className="wasd-input-wrapper" ovg="">
                        <div ovg="" className="wasd-input">
                          <input
                            ovg=""
                            style={{ margin: 0 }}
                            value={settings.sub_message_template}
                            placeholder="используйте {name} чтобы заменить его на имя подписчика"
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                sub_message_template: e.target.value,
                              })
                            }
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
                        styles={customSelectStyles}
                        defaultValue={findTextOption(settings.sub_text_animation)}
                        isClearable={false}
                        isSearchable={false}
                        onChange={(value) =>
                          setSettings({
                            ...settings,
                            sub_text_animation: value.value,
                          })
                        }
                        options={animationText}
                        hideSelectedOptions={false}
                      />
                      <div
                        style={{
                          font: '600 16px "Open Sans"',
                          textTransform: "uppercase",
                        }}
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
                    <div className="preview">
                      <div
                        className="img"
                        style={{
                          backgroundImage: `url(${settings.sub_image})`,
                        }}
                      ></div>
                      <div className="wasd-input-wrapper" ovg="">
                        <div ovg="" className="wasd-input">
                          <input
                            ovg=""
                            style={{ margin: 0 }}
                            value={settings.sub_image}
                            placeholder="https://example.com/image.gif"
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                sub_image: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Звук</label>
                  </div>
                  <div className="right">
                    <div className="preview">
                      <button
                        disabled={isPlayed}
                        onClick={() => {
                          if (isPlayed) return;
                          const audio = new Audio(settings.sub_sound);
                          audio.volume = settings.sub_sound_volume / 100;
                          setIsPlayed(true);
                          audio.play();
                          audio.onended = () => {
                            setIsPlayed(false);
                          };
                          audio.onerror = (e) => {
                            setIsPlayed(false);
                            toast.error("Мы не можем воспроизвести этот звук");
                          };
                        }}
                      >
                        play
                      </button>
                      <div className="wasd-input-wrapper" ovg="">
                        <div ovg="" className="wasd-input">
                          <input
                            ovg=""
                            style={{ margin: 0 }}
                            value={settings.sub_sound}
                            placeholder="https://example.com/sound.mp3"
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                sub_sound: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Громкость звука</label>
                  </div>
                  <div className="right">
                    <RangeSlider
                      min={0}
                      max={100}
                      step={1}
                      value={settings.sub_sound_volume}
                      onChange={(changeEvent) =>
                        setSettings({
                          ...settings,
                          sub_sound_volume: Number(changeEvent.target.value),
                        })
                      }
                      tooltipLabel={(v) => v + "%"}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Длительность оповещения</label>
                  </div>
                  <div className="right">
                    <RangeSlider
                      min={2000}
                      max={300000}
                      step={1000}
                      value={settings.sub_alert_duration}
                      onChange={(changeEvent) =>
                        setSettings({
                          ...settings,
                          sub_alert_duration: Number(changeEvent.target.value),
                        })
                      }
                      tooltipLabel={(v) => v / 1000 + "сек"}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Задержка текста оповещения</label>
                  </div>
                  <div className="right">
                    <RangeSlider
                      min={0}
                      max={60000}
                      step={1000}
                      value={settings.sub_text_delay}
                      onChange={(changeEvent) =>
                        setSettings({
                          ...settings,
                          sub_text_delay: Number(changeEvent.target.value),
                        })
                      }
                      tooltipLabel={(v) => v / 1000 + "сек"}
                    />
                  </div>
                </div>
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
                      styles={customSelectStyles}
                      defaultValue={{
                        label: settings.raid_layout,
                        value: settings.raid_layout,
                      }}
                      isClearable={false}
                      isSearchable={false}
                      onChange={(value) =>
                        setSettings({
                          ...settings,
                          raid_layout: value.value,
                        })
                      }
                      options={[
                        {
                          label: "вверху",
                          value: "above",
                        },
                        {
                          label: "баннер",
                          value: "banner",
                        },
                        {
                          label: "боковая",
                          value: "side",
                        },
                      ]}
                      hideSelectedOptions={false}
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
                        styles={customSelectStyles}
                        defaultValue={findAlertShowOption(settings.raid_show_animation)}
                        isClearable={false}
                        isSearchable={false}
                        onChange={(value) =>
                          setSettings({
                            ...settings,
                            raid_show_animation: value.value,
                          })
                        }
                        options={animationAlertShow}
                        hideSelectedOptions={false}
                      />
                      <Select
                        styles={customSelectStyles}
                        defaultValue={findAlertHideOption(settings.raid_hide_animation)}
                        isClearable={false}
                        isSearchable={false}
                        onChange={(value) =>
                          setSettings({
                            ...settings,
                            raid_hide_animation: value.value,
                          })
                        }
                        options={animationAlertHide}
                        hideSelectedOptions={false}
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
                      <div className="wasd-input-wrapper" ovg="">
                        <div ovg="" className="wasd-input">
                          <input
                            ovg=""
                            style={{ margin: 0 }}
                            value={settings.raid_message_template}
                            placeholder="используйте {name} чтобы заменить его на имя рейдера"
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                raid_message_template: e.target.value,
                              })
                            }
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
                        styles={customSelectStyles}
                        defaultValue={findTextOption(settings.raid_text_animation)}
                        isClearable={false}
                        isSearchable={false}
                        onChange={(value) =>
                          setSettings({
                            ...settings,
                            raid_text_animation: value.value,
                          })
                        }
                        options={animationText}
                        hideSelectedOptions={false}
                      />
                      <div
                        style={{
                          font: '600 16px "Open Sans"',
                          textTransform: "uppercase",
                        }}
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
                    <div className="preview">
                      <div
                        className="img"
                        style={{
                          backgroundImage: `url(${settings.raid_image})`,
                        }}
                      ></div>
                      <div className="wasd-input-wrapper" ovg="">
                        <div ovg="" className="wasd-input">
                          <input
                            ovg=""
                            style={{ margin: 0 }}
                            value={settings.raid_image}
                            placeholder="https://example.com/image.gif"
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                raid_image: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Звук</label>
                  </div>
                  <div className="right">
                    <div className="preview">
                      <button
                        disabled={isPlayed}
                        onClick={() => {
                          if (isPlayed) return;
                          const audio = new Audio(settings.raid_sound);
                          audio.volume = settings.raid_sound_volume / 100;
                          setIsPlayed(true);
                          audio.play();
                          audio.onended = () => {
                            setIsPlayed(false);
                          };
                          audio.onerror = (e) => {
                            setIsPlayed(false);
                            toast.error("Мы не можем воспроизвести этот звук");
                          };
                        }}
                      >
                        play
                      </button>
                      <div className="wasd-input-wrapper" ovg="">
                        <div ovg="" className="wasd-input">
                          <input
                            ovg=""
                            style={{ margin: 0 }}
                            value={settings.raid_sound}
                            placeholder="https://example.com/sound.mp3"
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                raid_sound: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Громкость звука</label>
                  </div>
                  <div className="right">
                    <RangeSlider
                      min={0}
                      max={100}
                      step={1}
                      value={settings.raid_sound_volume}
                      onChange={(changeEvent) =>
                        setSettings({
                          ...settings,
                          raid_sound_volume: Number(changeEvent.target.value),
                        })
                      }
                      tooltipLabel={(v) => v + "%"}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Длительность оповещения</label>
                  </div>
                  <div className="right">
                    <RangeSlider
                      min={2000}
                      max={300000}
                      step={1000}
                      value={settings.raid_alert_duration}
                      onChange={(changeEvent) =>
                        setSettings({
                          ...settings,
                          raid_alert_duration: Number(changeEvent.target.value),
                        })
                      }
                      tooltipLabel={(v) => v / 1000 + "сек"}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="left">
                    <label>Задержка текста оповещения</label>
                  </div>
                  <div className="right">
                    <RangeSlider
                      min={0}
                      max={60000}
                      step={1000}
                      value={settings.raid_text_delay}
                      onChange={(changeEvent) =>
                        setSettings({
                          ...settings,
                          raid_text_delay: Number(changeEvent.target.value),
                        })
                      }
                      tooltipLabel={(v) => v / 1000 + "сек"}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="item__border"></div>
            <div
              className="flat-btn ovg"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <button onClick={onSave} disabled={isLoadingUpdate} className={`primary medium ovg`} style={{ width: "300px" }}>
                {isLoadingUpdate ? <ButtonLoading /> : "Сохранить"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DashboardAlertBox;
