import CheckBox from "../../../../components/UI/CheckBox";
import ColorPicker from "../../../../components/UI/ColorPicker";
import Input from "../../../../components/UI/Input";
import Select from "../../../../components/UI/Select";
import Slider from "../../../../components/UI/Slider";

const General = ({ settings, setSettings }) => {
  return (
    <>
      <div className="row">
        <div className="left">
          <label>Тема</label>
        </div>
        <div className="right" style={{ color: "var(--wasd-color-text-disabled)" }}>
          {/* <Select
            defaultValue={{ value: settings.theme }}
            onChange={(value) => setSettings({ ...settings, theme: value.value })}
            options={[
              { label: "чистая", value: "clean" },
              { label: "wasd.tv", value: "wasd" },
            ]}
          /> */}
          ..soon
        </div>
      </div>
      <div className="row">
        <div className="left">
          <label>Значки</label>
        </div>
        <div className="right">
          <CheckBox
            text="Показать значки создателя"
            checked={settings.show_owner_icons}
            onChange={(e) => setSettings({ ...settings, show_owner_icons: e.target.checked })}
            style={{ marginBottom: 4 }}
          />
          <CheckBox
            text="Показать значки модераторов"
            checked={settings.show_moderator_icons}
            onChange={(e) => setSettings({ ...settings, show_moderator_icons: e.target.checked })}
            style={{ marginBottom: 4 }}
          />
          <CheckBox
            text="Показать значки подписчика"
            checked={settings.show_subscriber_icons}
            onChange={(e) => setSettings({ ...settings, show_subscriber_icons: e.target.checked })}
            style={{ marginBottom: 4 }}
          />
          <CheckBox text="Показать промо-значки" checked={settings.show_promo_icons} onChange={(e) => setSettings({ ...settings, show_promo_icons: e.target.checked })} style={{ marginBottom: 4 }} />
          <CheckBox
            text="Показать значки партнера"
            checked={settings.show_partner_icons}
            onChange={(e) => setSettings({ ...settings, show_partner_icons: e.target.checked })}
            style={{ marginBottom: 4 }}
          />
          <CheckBox text="Показать значки администратора" checked={settings.show_admin_icons} onChange={(e) => setSettings({ ...settings, show_admin_icons: e.target.checked })} />
        </div>
      </div>
      <div className="row">
        <div className="left">
          <label>Цвет фона</label>
        </div>
        <div className="right">
          <ColorPicker value={settings.background_color} onChange={(color) => setSettings({ ...settings, background_color: color })} />
        </div>
      </div>
      <div className="row">
        <div className="left">
          <label>Цвет текста</label>
        </div>
        <div className="right">
          <ColorPicker value={settings.text_color} onChange={(color) => setSettings({ ...settings, text_color: color })} />
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
            step={1}
            value={settings.text_size?.replace("px", "")}
            onChange={(changeEvent) => setSettings({ ...settings, text_size: changeEvent.target.value + "px" })}
            tooltipLabel={(v) => v + "px"}
          />
        </div>
      </div>
      <div className="row">
        <div className="left">
          <label>Стикеры</label>
        </div>
        <div className="right">
          <CheckBox text="Показывать стикеры" checked={settings.show_sticker} onChange={(e) => setSettings({ ...settings, show_sticker: e.target.checked })} />
          {settings.show_sticker && (
            <CheckBox
              text="Большой размер стикеров"
              checked={settings.sticker_size === "large"}
              onChange={(e) => setSettings({ ...settings, sticker_size: e.target.checked ? "large" : "small" })}
              style={{ marginTop: 4 }}
            />
          )}
        </div>
      </div>
      <div className="row">
        <div className="left">
          <label>BetterWASYA</label>
        </div>
        <div className="right">
          <CheckBox
            text="Использовать цвета имени"
            checked={settings.better_paints_enabled}
            onChange={(e) => setSettings({ ...settings, better_paints_enabled: e.target.checked })}
            style={{ marginBottom: 4 }}
          />
          <CheckBox text="Использовать иконки подписчика" checked={settings.better_badges_enabled} onChange={(e) => setSettings({ ...settings, better_badges_enabled: e.target.checked })} />
        </div>
      </div>
      <div className="row">
        <div className="left">
          <label>Скрыть сообщение после</label>
        </div>
        <div className="right">
          <CheckBox text="Всегда показывать сообщения" checked={settings.always_show_messages} onChange={(e) => setSettings({ ...settings, always_show_messages: e.target.checked })} />
          {!settings.always_show_messages && (
            <Slider
              min={500}
              max={200000}
              step={500}
              value={settings.message_hide_delay}
              onChange={(changeEvent) => setSettings({ ...settings, message_hide_delay: Number(changeEvent.target.value) })}
              tooltipLabel={(v) => v / 1000 + "сек"}
            />
          )}
        </div>
      </div>
      <div className="row">
        <div className="left">
          <label>Задержка чата</label>
        </div>
        <div className="right">
          <Slider
            min={0}
            max={6000}
            step={100}
            value={settings.message_show_delay}
            onChange={(changeEvent) => setSettings({ ...settings, message_show_delay: Number(changeEvent.target.value) })}
            tooltipLabel={(v) => v / 1000 + "сек"}
          />
        </div>
      </div>
      <div className="row">
        <div className="left">
          <label>Не показывать в чате</label>
        </div>
        <div className="right">
          <CheckBox text="Скрыть команды, начинающиеся с `!`" checked={settings.hide_commands} onChange={(e) => setSettings({ ...settings, hide_commands: e.target.checked })} />
        </div>
      </div>
      <div className="row">
        <div className="left">
          <label>Отключенные пользователи чата</label>
        </div>
        <div className="right">
          <Input placeholder="Скрыть пользователей из чата, через пробел" value={settings.muted_chatters.join(" ")} onChange={(e) => setSettings({ ...settings, muted_chatters: e.target.value.toLowerCase().replace(/\s+/g, ' ').split(" ")})} />
        </div>
      </div>
      <div className="row">
        <div className="left">
          <label>Пользовательские плохие слова</label>
        </div>
        <div className="right">
          <Input placeholder="щенки бананы котята" value={settings.profanity_custom_words.join(" ")} onChange={(e) => setSettings({ ...settings, profanity_custom_words: e.target.value.toLowerCase().replace(/\s+/g, ' ').split(" ")})} />
        </div>
      </div>
    </>
  );
};

export default General;
