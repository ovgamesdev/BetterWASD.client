import { useState } from "react";
import { useEffect, useRef } from "react";

import useComponentVisible from "../../../../hooks/useComponentVisible/index.tsx";
import useFocus from "../../../../hooks/useFocus/index.tsx";
import Option from "../Option";

import "../select.scss";

const CreatableSelect = ({ onChange = () => {}, options = [], defaultValue = {} }) => {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false, (is) => {
    is && setInputFocus(true);
  });

  const selectLink = useRef(null);
  const [search, setSearch] = useState("");
  const [inputRef, setInputFocus] = useFocus();
  const [filtredOptions, setFiltredOptions] = useState(options);

  const value = () => {
    if (typeof options[0]?.options !== "object") {
      const found = options.find((v) => v.value === defaultValue.value)?.label;
      if (found) return found;
    }

    if (typeof options[0]?.options === "undefined") {
      return defaultValue.value;
    }
  };

  useEffect(() => {
    const active = document.querySelector(".menu__list--option.active");
    active && selectLink.current && selectLink.current.scrollTo(0, active.offsetTop);
  });

  useEffect(() => {
    const f = options.filter((option) => option.label.toLowerCase().match(search.toLowerCase()));
    setFiltredOptions(f);
  }, [search, options]);

  return (
    <div className="select--container" ref={ref}>
      <div className={`select--control ${isComponentVisible ? "active" : ""}`} onClick={() => setIsComponentVisible(!isComponentVisible)}>
        <div className="select--value__container">
          {search === "" && <div className="select--value">{value()}</div>}
          <div className="select--input">
            <input ref={inputRef} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="select--indicators__container">
          <div className="select--indicator__separator"></div>
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
            {typeof filtredOptions[0]?.options !== "object" &&
              filtredOptions.map((option) => (
                <Option
                  key={option.value}
                  onClick={(selected) => {
                    onChange(selected);
                    setIsComponentVisible(false);
                    setSearch("");
                  }}
                  defaultValue={defaultValue}
                  option={option}
                />
              ))}
            {typeof filtredOptions[0]?.options === "undefined" && (
              <Option
                onClick={(selected) => {
                  onChange(selected);
                  setIsComponentVisible(false);
                  setSearch("");
                }}
                defaultValue={defaultValue}
                option={{ value: search, label: `Создать "${search}"` }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatableSelect;
