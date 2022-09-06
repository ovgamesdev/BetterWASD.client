const makeid = (length = 15) => {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const CheckBox = ({ checked, onChange, text }) => {
  const id = makeid();

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <input type="checkbox" checked={checked} onChange={onChange} id={id} />
      <label htmlFor={id} style={{ marginLeft: "8px", fontSize: "12px", opacity: ".8", cursor: "pointer" }}>
        {text}
      </label>
    </div>
  );
};

export default CheckBox;
