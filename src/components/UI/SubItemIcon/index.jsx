import React from "react";
// import './style.css'
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
    <div className={`${subStyle.item} ${isLoadedImages[item] ? "" : "warning"}`}>
      <img
        width={20}
        height={20}
        src={subIcons[item] || defBadges[item]}
        onLoad={() => setIsLoadedImages({ ...isLoadedImages, [item]: true })}
        onError={() => setIsLoadedImages({ ...isLoadedImages, [item]: false })}
        alt="avatar"
      />
      <span style={{ minWidth: "50px" }}>{title[item]}</span>

      <div className="wasd-input-wrapper">
        <div className="wasd-input">
          <label className={isLoadedImages[item] ? "" : "show"}>Недействительная ссылка на картинку</label>
          <input
            value={subIcons[item] || ""}
            onChange={(e) => setSubIcons({ ...subIcons, [item]: e.target.value })}
            placeholder="Ссылка на иконку подписчика"
          ></input>
        </div>
      </div>
    </div>
  );
};

export default TabGroup;
