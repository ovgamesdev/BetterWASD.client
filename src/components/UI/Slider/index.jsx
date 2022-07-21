import "./slider.scss";

const lerp = (a, b, t) => (b - a) * t + a;
const unlerp = (a, b, t) => (t - a) / (b - a);
const map = (a1, b1, a2, b2, t) => lerp(a2, b2, unlerp(a1, b1, t));

const Slider = ({ min, max, onChange, step, tooltipLabel = (v) => v, value }) => {
  return (
    <div className="range-slider__wrap">
      <input
        type="range"
        min={min}
        max={max}
        className="range-slider range-slider--primary"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        step={step}
        value={value}
        onChange={onChange}
      />
      <div className="range-slider__tooltip range-slider__tooltip--auto range-slider__tooltip--bottom" style={{ left: `calc(${map(min, max, 0, 100, value)}% + ${map(min, max, 10, -10, value)}px)` }}>
        <div className="range-slider__tooltip__label">{tooltipLabel(value)}</div>
        <div className="range-slider__tooltip__caret" />
      </div>
    </div>
  );
};

export default Slider;
