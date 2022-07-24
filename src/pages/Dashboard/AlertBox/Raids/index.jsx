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

const fontOptions = fonts.map((v) => ({ label: v, value: v }));

const Raids = ({ settings, setSettings }) => {
  return (
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
            <Select defaultValue={{ value: settings.raid_show_animation }} onChange={(value) => setSettings({ ...settings, raid_show_animation: value.value })} options={animationAlertShow} />
            <Select defaultValue={{ value: settings.raid_hide_animation }} onChange={(value) => setSettings({ ...settings, raid_hide_animation: value.value })} options={animationAlertHide} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="left">
          <label>Шаблон сообщения</label>
        </div>
        <div className="right">
          <div style={{ display: "flex" }}>
            <Input
              value={settings.raid_message_template}
              placeholder="используйте {name} чтобы заменить его на имя рейдера"
              onChange={(e) => setSettings({ ...settings, raid_message_template: e.target.value })}
            />
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
            <Select defaultValue={{ value: settings.raid_text_animation }} onChange={(value) => setSettings({ ...settings, raid_text_animation: value.value })} options={animationText} />
            <div style={{ font: '600 16px "Open Sans"', textTransform: "uppercase" }} className="preview">
              {"SampleText".split("").map((w, i) => (
                <span key={i} className={`animated-letter ${settings.raid_text_animation}`}>
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
            <CreatableSelect defaultValue={{ value: settings.raid_font }} onChange={(value) => setSettings({ ...settings, raid_font: value.value })} options={fontOptions} />
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
            <ColorPicker value={settings.raid_font_color} onChange={(color) => setSettings({ ...settings, raid_font_color: color })} />
          </div>
        </div>
        <div className="row">
          <div className="left">
            <label>Цвет выделения текста</label>
          </div>
          <div className="right">
            <ColorPicker value={settings.raid_font_color2} onChange={(color) => setSettings({ ...settings, raid_font_color2: color })} />
          </div>
        </div>
      </Accordion>
    </>
  );
};

export default Raids;
