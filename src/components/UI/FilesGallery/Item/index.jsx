import React, { useState } from "react";

import styles from "./emote.module.scss";

import playSvg from "../svg/play.svg";
import pauseSvg from "../svg/pause.svg";

const GalleryItem = ({ onSelect, onDelete, onPlay, itemPlayed, data, active, access }) => {
  const [isHover, setIsHover] = useState(false);

  const isCanPlay = data.mimeType.includes("audio");

  return (
    <div
      className={styles.wrapper}
      onDoubleClick={() => onSelect(data)}
      onClick={(e) => e.target.className !== styles["delete-emote"] && isCanPlay && onPlay(data)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className={styles.card}>
        <img
          referrerPolicy="no-referrer"
          src={!isCanPlay ? data.thumbnailLink || data.iconLink : itemPlayed?.rawLink !== data.rawLink ? (isHover ? playSvg : data.thumbnailLink || data.iconLink) : pauseSvg}
          alt={data.name}
        />

        {access && (
          <div className={styles["delete-emote"]} onClick={() => onDelete(data)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px">
              <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z" />
            </svg>
          </div>
        )}

        {active.rawLink === data.rawLink && (
          <div className={styles["active-item"]}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" width="23px" height="23px">
              <path d="m10.575 16.725 7.15-7.15L16.15 8l-5.575 5.6L7.8 10.8l-1.55 1.575ZM12 22.2q-2.125 0-3.988-.8-1.862-.8-3.237-2.175Q3.4 17.85 2.6 15.988 1.8 14.125 1.8 12t.8-3.988q.8-1.862 2.175-3.237Q6.15 3.4 8.012 2.6 9.875 1.8 12 1.8t3.988.8q1.862.8 3.237 2.175Q20.6 6.15 21.4 8.012q.8 1.863.8 3.988t-.8 3.988q-.8 1.862-2.175 3.237Q17.85 20.6 15.988 21.4q-1.863.8-3.988.8Zm0-2.275q3.325 0 5.625-2.3t2.3-5.625q0-3.325-2.3-5.625T12 4.075q-3.325 0-5.625 2.3T4.075 12q0 3.325 2.3 5.625t5.625 2.3ZM12 12Z" />
            </svg>
          </div>
        )}

        <div>
          <span>{data.name}</span>
        </div>
      </div>
    </div>
  );
};

export default GalleryItem;
