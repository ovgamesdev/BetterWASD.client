import ColorPicker from "../../../../components/UI/ColorPicker";
import Slider from "../../../../components/UI/Slider";

const General = ({ settings, setSettings }) => {
  return (
    <>
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
            <input type="checkbox" checked={settings.interrupt_mode} onChange={(changeEvent) => setSettings({ ...settings, interrupt_mode: changeEvent.target.checked })} id="interrupt_mode" />
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
  );
};

export default General;
