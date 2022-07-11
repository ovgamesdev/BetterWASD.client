import React, { useState, useEffect } from "react";

const TabGroup = (props) => {
  const [active, setActive] = useState({ index: props.active, element: null });
  const [position, setPosition] = useState({ left: 0, width: 0 });

  const [first, setFirst] = useState(null);
  const [isF, setIsF] = useState(0);

  const onClick = (e, index) => {
    setActive({ index: index, element: e });
    if (index === 0) {
      setPosition({ left: e.target.offsetLeft, width: e.target.offsetWidth - 16 });
    } else {
      setPosition({ left: e.target.offsetLeft + 16, width: e.target.offsetWidth - 32 });
    }
    props.onChange(index);
  };

  useEffect(() => {
    if (!active.element && first) first?.click();
    setIsF((i) => i + 1);
  }, [first, active.element]);

  return (
    <section className="tabs-wrapper horizontal left medium" style={{ padding: "0", ...props.style }}>
      <div className="tabs">
        <div className="items">
          {props.tabs &&
            props.tabs.map((tab, index) => (
              <div
                key={index}
                ref={(e) => index === active.index && setFirst(e)}
                onClick={(e) => onClick(e, index)}
                className={`item ${index === active.index ? "item-active" : ""}`}
              >
                {tab.title}
              </div>
            ))}
          <div
            className="inkbar"
            style={{ width: position.width + "px", left: position.left + "px", transition: isF > 3 ? "left 0.2s, width 0.2s" : "" }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default TabGroup;
