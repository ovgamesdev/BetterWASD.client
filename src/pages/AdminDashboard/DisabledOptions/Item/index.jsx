import "../../Bell/Item/unset-style.scss";

const SupportItem = ({ data, onDelete }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
      {data}
      <div className="flat-btn" style={{ paddingLeft: 10 }}>
        <button onClick={() => onDelete(data)} className="primary medium">
          удалить
        </button>
      </div>
    </div>
  );
};

export default SupportItem;
