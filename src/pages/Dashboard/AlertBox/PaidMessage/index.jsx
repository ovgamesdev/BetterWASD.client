import ReactTooltip from "react-tooltip";

import ColorPicker from "../../../../components/UI/ColorPicker";
import Accordion from "../../../../components/UI/Accordion";
import FilesGallery from "../../../../components/UI/FilesGallery";
import Input from "../../../../components/UI/Input";
import Select from "../../../../components/UI/Select";
import CreatableSelect from "../../../../components/UI/Select/Creatable";
import Slider from "../../../../components/UI/Slider";

import fonts from "../fonts.json";
import animationAlertShow from "../animation-alert-show.json";
import animationAlertHide from "../animation-alert-hide.json";
import animationText from "../animation-text.json";
import CheckBox from "../../../../components/UI/CheckBox";

const fontOptions = fonts.map((v) => ({ label: v, value: v }));

const Raids = ({ settings, setSettings }) => {
  return (
    <>
      <div className="row">
        <div className="left">
          <label>Включено</label>
        </div>
        <div className="right">
          <CheckBox checked={settings.paid_message_enabled} onChange={(e) => setSettings({ ...settings, paid_message_enabled: e.target.checked })} />
        </div>
      </div>
      <div className="row">
        <div className="left">
          <label>Расположение</label>
        </div>
        <div className="right">
          <Select
            defaultValue={{ value: settings.paid_message_layout }}
            onChange={(value) => setSettings({ ...settings, paid_message_layout: value.value })}
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
              defaultValue={{ value: settings.paid_message_show_animation }}
              onChange={(value) => setSettings({ ...settings, paid_message_show_animation: value.value })}
              options={animationAlertShow}
            />
            <Select
              defaultValue={{ value: settings.paid_message_hide_animation }}
              onChange={(value) => setSettings({ ...settings, paid_message_hide_animation: value.value })}
              options={animationAlertHide}
            />
          </div>
        </div>
      </div>

      <Accordion title_open="Открыть преобразование текста в речь" title_close="Закрыть преобразование текста в речь">
        <div className="row">
          <div className="left">
            <label>Включено</label>
          </div>
          <div className="right">
            <CheckBox text="преобразование текста в речь" checked={settings.paid_message_tts_enabled} onChange={(e) => setSettings({ ...settings, paid_message_tts_enabled: e.target.checked })} />
          </div>
        </div>
        <div className="row">
          <div className="left">
            <label>Мин. Пожертвования для чтения</label>
          </div>
          <div className="right">
            <Input type="number" value={settings.paid_message_tts_min_amount} onChange={(e) => setSettings({ ...settings, paid_message_tts_min_amount: Number(e.target.value) })} />
          </div>
        </div>
        <div className="row">
          <div className="left">
            <label>Блокировка повторения спама</label>
          </div>
          <div className="right">
            <Slider
              min={0}
              max={100}
              step={1}
              value={Number(settings.paid_message_tts_repetition_block_length)}
              onChange={(e) => setSettings({ ...settings, paid_message_tts_repetition_block_length: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="row">
          <div className="left">
            <label>Громкость</label>
          </div>
          <div className="right">
            <Slider
              min={0}
              max={100}
              step={1}
              value={settings.paid_message_tts_volume}
              onChange={(e) => setSettings({ ...settings, paid_message_tts_volume: Number(e.target.value) })}
              tooltipLabel={(v) => v + "%"}
            />
          </div>
        </div>
        <div className="row">
          <div className="left">
            <label>Включить шаблон сообщения в TTS</label>
          </div>
          <div className="right">
            <CheckBox checked={settings.paid_message_tts_include_message_template} onChange={(e) => setSettings({ ...settings, paid_message_tts_include_message_template: e.target.checked })} />
          </div>
        </div>
      </Accordion>

      <div className="row">
        <div className="left">
          <label>Мин сумма для оповещения</label>
        </div>
        <div className="right">
          <Input type="number" value={settings.paid_message_alert_min_amount} onChange={(e) => setSettings({ ...settings, paid_message_alert_min_amount: Number(e.target.value) })} />
        </div>
      </div>
      <div className="row">
        <div className="left">
          <label>Шаблон сообщения</label>
        </div>
        <div className="right">
          <div style={{ display: "flex" }}>
            <Input
              value={settings.paid_message_message_template}
              placeholder="используйте {name} чтобы заменить его на имя рейдера"
              onChange={(e) => setSettings({ ...settings, paid_message_message_template: e.target.value })}
            />
            <div className="tooltip_wrapper" data-tip="{name} - Имя рейдера <br/> {amount} - Сумма">
              ?
            </div>

            <ReactTooltip multiline={true} effect="solid" />
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
              defaultValue={{ value: settings.paid_message_text_animation }}
              onChange={(value) => setSettings({ ...settings, paid_message_text_animation: value.value })}
              options={animationText}
            />
            <div style={{ font: '600 16px "Open Sans"', textTransform: "uppercase" }} className="preview">
              {"SampleText".split("").map((w, i) => (
                <span key={i} className={`animated-letter ${settings.paid_message_text_animation}`}>
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
            value={settings.paid_message_image_metadata}
            title="Галерея изображений"
            title_link="Ссылка на изображение"
            fileType="images"
            fileAccept=".jpg,.png,.gif,.jpeg,.svg,.webp,.avif,.webm,.mp4"
            onChange={(value) => setSettings({ ...settings, paid_message_image: value.raw, paid_message_image_metadata: value.metadata })}
          />
        </div>
      </div>
      <div className="row">
        <div className="left">
          <label>Звук</label>
        </div>
        <div className="right">
          <FilesGallery
            value={settings.paid_message_sound_metadata}
            title="Галерея звуков"
            title_link="Ссылка на аудио"
            fileType="sounds"
            fileAccept=".mp3,.wav,.ogg"
            onChange={(value) => setSettings({ ...settings, paid_message_sound: value.raw, paid_message_sound_metadata: value.metadata })}
            sound_volume={settings.paid_message_sound_volume}
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
            value={settings.paid_message_sound_volume}
            onChange={(e) => setSettings({ ...settings, paid_message_sound_volume: Number(e.target.value) })}
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
            value={settings.paid_message_alert_duration}
            onChange={(e) => setSettings({ ...settings, paid_message_alert_duration: Number(e.target.value) })}
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
            value={settings.paid_message_text_delay}
            onChange={(e) => setSettings({ ...settings, paid_message_text_delay: Number(e.target.value) })}
            tooltipLabel={(v) => v / 1000 + "сек"}
          />
        </div>
      </div>

      <Accordion title_open="Открыть настройки сообщения" title_close="Закрыть настройки сообщения">
        <div className="row">
          <div className="left">
            <label>Показать сообщение</label>
          </div>
          <div className="right">
            <CheckBox checked={settings.paid_message_message_show} onChange={(e) => setSettings({ ...settings, paid_message_message_show: e.target.checked })} />
          </div>
        </div>
        <div className="row">
          <div className="left">
            <label>Эмоции</label>
          </div>
          <div className="right">
            <CheckBox
              text="Разрешить эмоции BetterWASYA"
              checked={settings.paid_message_message_allow_emotes}
              onChange={(e) => setSettings({ ...settings, paid_message_message_allow_emotes: e.target.checked })}
            />
          </div>
        </div>
        <div className="row">
          <div className="left">
            <label>Минимальная сумма для показа</label>
          </div>
          <div className="right">
            <Input type="number" value={settings.paid_message_alert_message_min_amount} onChange={(e) => setSettings({ ...settings, paid_message_alert_message_min_amount: Number(e.target.value) })} />
          </div>
        </div>
        <div className="row">
          <div className="left">
            <label>Шрифт</label>
          </div>
          <div className="right">
            <CreatableSelect
              defaultValue={{ value: settings.paid_message_message_font }}
              onChange={(value) => setSettings({ ...settings, paid_message_message_font: value.value })}
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
              value={Number(settings.paid_message_message_font_size?.replace("px", ""))}
              onChange={(e) => setSettings({ ...settings, paid_message_message_font_size: e.target.value + "px" })}
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
              value={Number(settings.paid_message_message_font_weight)}
              onChange={(e) => setSettings({ ...settings, paid_message_message_font_weight: e.target.value.toString() })}
            />
          </div>
        </div>
        <div className="row">
          <div className="left">
            <label>Цвет текста</label>
          </div>
          <div className="right">
            <ColorPicker value={settings.paid_message_message_font_color} onChange={(color) => setSettings({ ...settings, paid_message_message_font_color: color })} />
          </div>
        </div>
      </Accordion>

      <Accordion title_open="Открыть настройки шрифта" title_close="Закрыть настройки шрифта">
        <div className="row">
          <div className="left">
            <label>Шрифт</label>
          </div>
          <div className="right">
            <CreatableSelect defaultValue={{ value: settings.paid_message_font }} onChange={(value) => setSettings({ ...settings, paid_message_font: value.value })} options={fontOptions} />
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
              value={Number(settings.paid_message_font_size?.replace("px", ""))}
              onChange={(e) => setSettings({ ...settings, paid_message_font_size: e.target.value + "px" })}
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
              value={Number(settings.paid_message_font_weight)}
              onChange={(e) => setSettings({ ...settings, paid_message_font_weight: e.target.value.toString() })}
            />
          </div>
        </div>
        <div className="row">
          <div className="left">
            <label>Цвет текста</label>
          </div>
          <div className="right">
            <ColorPicker value={settings.paid_message_font_color} onChange={(color) => setSettings({ ...settings, paid_message_font_color: color })} />
          </div>
        </div>
        <div className="row">
          <div className="left">
            <label>Цвет выделения текста</label>
          </div>
          <div className="right">
            <ColorPicker value={settings.paid_message_font_color2} onChange={(color) => setSettings({ ...settings, paid_message_font_color2: color })} />
          </div>
        </div>
      </Accordion>
    </>
  );
};

export default Raids;
