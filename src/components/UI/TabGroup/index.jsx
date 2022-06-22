import React, { useState, useEffect } from "react";
import classnames from "classnames";

const TabGroup = (props) => {
  const [active, setActive] = useState({ index: props.active, element: null });
  const [position, setPosition] = useState({ left: 0, width: 0 });

  const [first, setFirst] = useState(null);

  const onClick = (e, index) => {
    setActive({ index: index, element: e });
    if (index === 0) {
      setPosition({
        left: e.target.offsetLeft,
        width: e.target.offsetWidth - 16,
      });
    } else {
      setPosition({
        left: e.target.offsetLeft + 16,
        width: e.target.offsetWidth - 32,
      });
    }
    props.onChange(index);
  };

  useEffect(() => {
    if (!active.element && first) first?.click();
  }, [first, active.element]);

  return (
    <section
      className="tabs-wrapper horizontal left medium"
      style={{ padding: "0", ...props.style }}
    >
      <div className="tabs">
        <div className="items">
          {props.tabs &&
            props.tabs.map((tab, index) => (
              <button
                key={index}
                ref={(e) => {
                  index === active.index && setFirst(e);
                }}
                onClick={(e) => onClick(e, index)}
                className={classnames(
                  "item",
                  index === active.index ? "item-active" : ""
                )}
              >
                {tab.title}
              </button>
            ))}
          <div
            className="inkbar animated"
            style={{ width: position.width + "px", left: position.left + "px" }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default TabGroup;
