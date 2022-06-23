import { components } from "react-select";

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input type="checkbox" checked={props.isSelected} onChange={() => null} />{" "}
        <label style={{ paddingLeft: "5px" }}>{props.label}</label>
      </components.Option>
    </div>
  );
};

export default Option;
