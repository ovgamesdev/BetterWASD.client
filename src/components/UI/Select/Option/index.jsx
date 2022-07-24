import { useState } from "react";

const Option = ({ onClick, defaultValue, option, isMulti }) => {
  const isActive = typeof defaultValue.value === "string" ? option.value === defaultValue.value : defaultValue.find((o) => o.value === option.value);

  const [getIsActive, setIsActive] = useState(isActive);

  const addOption = () => {
    defaultValue.push(option);
    return defaultValue;
  };
  const removeOption = () => defaultValue.filter((v) => v.value !== option.value);

  return (
    <div
      className={`menu__list--option ${!isMulti && getIsActive ? "active" : ""}`}
      onClick={() => {
        onClick(!isMulti ? option : getIsActive ? removeOption() : addOption());
        setIsActive(!isActive);
      }}
    >
      {isMulti && <input readOnly type="checkbox" checked={getIsActive} />}
      <label className={isMulti ? "option--label" : ""}>{option.label}</label>
    </div>
  );
};

export default Option;
