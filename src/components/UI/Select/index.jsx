import { useEffect, useRef } from "react";

import useComponentVisible from "../../../hooks/useComponentVisible/index.tsx";
import Group from "./Group";
import Option from "./Option";

import "./select.scss";

const Select = ({ onChange, options, defaultValue, isMulti, title }) => {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible();

  const selectLink = useRef(null);

  const value = () => {
    if (options[0] && !options[0].options) {
      return options.find((v) => v.value === defaultValue.value)?.label;
    }

    let res = false;
    if (options[0] && options[0].options) {
      options.forEach((g) => {
        if (res) return;
        res = g.options.find((v) => v.value === defaultValue.value)?.label;
      });
      return res;
    }
  };

  useEffect(() => {
    const active = document.querySelector(".menu__list--option.active");
    active && selectLink.current && selectLink.current.scrollTo(0, active.offsetTop);
  });

  return (
    <div className="select--container" ref={ref}>
      <div className="select--control" onClick={() => setIsComponentVisible(!isComponentVisible)}>
        <div className="select--value__container">
          <div className="select--value">{isMulti ? title : value()}</div>
        </div>
        <div className="select--indicators__container">
          {!isMulti && <div className="select--indicator__separator"></div>}
          <div className="select--indicator__container">
            <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="svg">
              <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
            </svg>
          </div>
        </div>
      </div>

      {isComponentVisible && (
        <div className="select--menu">
          <div className="select--menu__list" ref={selectLink}>
            {typeof options[0].options !== "object" &&
              options.map((option) => (
                <Option
                  key={option.value}
                  onClick={(selected) => {
                    onChange(selected);
                    !isMulti && setIsComponentVisible(false);
                  }}
                  defaultValue={defaultValue}
                  option={option}
                  isMulti={isMulti}
                />
              ))}
            {typeof options[0].options === "object" &&
              options.map((group) => (
                <Group
                  key={group.options[0].value}
                  onClick={(selected) => {
                    onChange(selected);
                    !isMulti && setIsComponentVisible(false);
                  }}
                  defaultValue={defaultValue}
                  group={group}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
