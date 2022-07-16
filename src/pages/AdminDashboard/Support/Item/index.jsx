import { useState } from "react";
import Select from "../../../../components/UI/Select";

import "../../Bell/Item/unset-style.scss";

const StatusArr = [
  { value: "0", label: "Открыто" },
  { value: "1", label: "Обрабатывается" },
  { value: "2", label: "Закрыто" },
];
const StatusTitle = {
  0: "Открыто",
  1: "Обрабатывается",
  2: "Закрыто",
};

const SupportItem = ({ data, onDelete, onChange }) => {
  const [isChangeMode, setIsChangeMode] = useState(false);
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState(data.status);

  const { message, createdAt, user } = data;

  return (
    <div className="bell">
      <div style={{ background: "#142340", borderRadius: "8px" }}>
        <div className="bell-info__elem" style={{ paddingRight: "85px" }}>
          <div className="bell-info__text">{message}</div>
          {isChangeMode && (
            <>
              <textarea
                className="bell-info__text reset"
                style={{ marginTop: "15px" }}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
              <Select
                defaultValue={{ value: status.toString() }}
                onChange={(value) => setStatus(Number(value.value))}
                options={StatusArr}
              />
            </>
          )}
          <div className="bell-info__date">{user.user_login}</div>
          <div className="bell-info__date">{StatusTitle[status]}</div>
          <div className="bell-info__date">{new Date(createdAt).toLocaleString()}</div>
        </div>
        <div className="bell-buttons flat-btn" style={{ display: "flex", flexDirection: "column" }}>
          <button
            onClick={() => (isChangeMode ? onChange(data, status, response) : setIsChangeMode(!isChangeMode))}
            className="primary medium"
          >
            {isChangeMode ? "отправить" : "ответить"}
          </button>
          {isChangeMode && (
            <button onClick={() => setIsChangeMode(false)} className="primary medium" style={{ marginTop: "5px" }}>
              назад
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportItem;
