import { components } from "react-select";
import "./control.scss";

const Control = ({ children, ...rest }) => {
  return (
    <div className="control">
      <components.Control {...rest}>
        <label>Фильтр событий</label>
        {children[1]}
      </components.Control>
    </div>
  );
};

export default Control;
