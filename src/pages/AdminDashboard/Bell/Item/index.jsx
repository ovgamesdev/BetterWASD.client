import { useState } from "react";

import "./unset-style.scss";

const BellItem = ({ data, onDelete, onChange }) => {
  const [isChangeMode, setIsChangeMode] = useState(data.text === "");
  const [edited, setEdited] = useState(data);

  const { text, link, linkText, date, version } = edited;

  return (
    <div className="bell">
      <div style={{ background: "#142340", borderRadius: "8px" }}>
        <div className="bell-info__elem" style={{ paddingRight: "85px" }}>
          {!isChangeMode ? (
            <div className="bell-info__text">{text}</div>
          ) : (
            <textarea
              className="bell-info__text reset"
              value={edited.text}
              onChange={(e) => setEdited({ ...edited, text: e.target.value })}
            />
          )}
          {isChangeMode && (
            <input
              placeholder="https://example.com"
              className="bell-info__text reset"
              value={edited.link}
              onChange={(e) => setEdited({ ...edited, link: e.target.value })}
              style={{ marginBottom: "4px" }}
            />
          )}
          {isChangeMode && (
            <input
              placeholder="link text"
              className="bell-info__text reset"
              value={edited.linkText}
              onChange={(e) => setEdited({ ...edited, linkText: e.target.value })}
              style={{ marginBottom: "4px" }}
            />
          )}
          {isChangeMode && (
            <input
              placeholder="version (1.0.0 | site)"
              className="bell-info__text reset"
              value={edited.version}
              onChange={(e) => setEdited({ ...edited, version: e.target.value })}
            />
          )}
          {!isChangeMode && link && (
            <a className="bell-info__link" target="_blank" rel="noreferrer" href={link}>
              <span>{linkText}</span>
            </a>
          )}
          {!isChangeMode && version && <div className="bell-info__date">v: {version}</div>}
          <div className="bell-info__date">{new Date(date).toLocaleString()}</div>
        </div>
        <div className="bell-buttons flat-btn">
          <button onClick={() => onDelete(data)} className="warning medium-cube">
            del
          </button>
          {!isChangeMode && (
            <button onClick={() => setIsChangeMode(true)} className="primary medium-cube">
              edit
            </button>
          )}
          {isChangeMode && (
            <button
              onClick={() => {
                setIsChangeMode(false);
                if (
                  data.text !== edited.text ||
                  data.link !== edited.link ||
                  data.linkText !== edited.linkText ||
                  data.version !== edited.version
                )
                  onChange(edited);
              }}
              className="primary medium-cube"
            >
              chg
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BellItem;
