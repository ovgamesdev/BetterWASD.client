import React from "react";
// import './style.css'
import classnames from "classnames";
import subStyle from "./sub.module.scss";

const TabGroup = (props) => {
  const subIcons = props.subIcons;
  const defBadges = props.defBadges;
  const setIsLoadedImages = props.setIsLoadedImages;
  const isLoadedImages = props.isLoadedImages;
  const setSubIcons = props.setSubIcons;

  const item = props.item;

  const title = {
    "1mon": "1 мес.",
    "3mon": "3 мес.",
    "6mon": "6 мес.",
    "9mon": "9 мес.",
    "12mon": "1 г.",
    "18mon": "1,5 г.",
    "24mon": "2 г.",
  };

  return (
    <div
      className={classnames(
        subStyle.item,
        isLoadedImages[item] ? "" : "warning"
      )}
    >
      <img
        width={20}
        height={20}
        src={subIcons[item] || defBadges[item]}
        onLoad={(e) => setIsLoadedImages({ ...isLoadedImages, [item]: true })}
        onError={(e) => setIsLoadedImages({ ...isLoadedImages, [item]: false })}
        alt="avatar"
      />
      <span style={{ minWidth: "50px" }}>{title[item]}</span>

      <div ovg="" className="wasd-input-wrapper">
        <div ovg="" className="wasd-input">
          <label
            ovg=""
            className={classnames(isLoadedImages[item] ? "" : "show")}
          >
            Недействительная ссылка на картинку
          </label>
          <input
            ovg=""
            value={subIcons[item] || ""}
            onChange={(e) =>
              setSubIcons({ ...subIcons, [item]: e.target.value })
            }
            placeholder="Ссылка на иконку подписчика"
          ></input>
        </div>
      </div>
    </div>
  );
};

export default TabGroup;
