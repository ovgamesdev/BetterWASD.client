import "./input.scss";

const Input = ({
  children,
  value,
  style,
  inputStyle,
  className = "",
  inputClassName,
  onChange,
  onClick,
  onKeyDown,
  placeholder,
  type = "text",
  readOnly = false,
  autoFocus = false,
  disabled = false,
}) => {
  return (
    <div className="input-wrapper" style={{ flexDirection: "column", alignItems: "stretch", ...style }}>
      <div className={`input-content ${className}`}>
        {children}
        {type === "textarea" ? (
          <textarea
            style={{ margin: "0", ...inputStyle }}
            className={inputClassName}
            placeholder={placeholder}
            type={type}
            readOnly={readOnly}
            autoFocus={autoFocus}
            value={value}
            onChange={onChange}
            onClick={onClick}
            onKeyDown={onKeyDown}
            disabled={disabled}
          />
        ) : (
          <input
            style={{ margin: "0", ...inputStyle }}
            className={inputClassName}
            placeholder={placeholder}
            type={type}
            readOnly={readOnly}
            autoFocus={autoFocus}
            value={value}
            onChange={onChange}
            onClick={onClick}
            onKeyDown={onKeyDown}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
};

export const FlatBtn = ({ children, type = "", display = "flex" }) => {
  return (
    <div className="flat-btn" style={{ display: "flex" }}>
      {children}
    </div>
  );
};

export default Input;
