import React from "react";
import { Link } from "react-router-dom";
import { decode } from "../../../lib/code-mnem";
import { HOSTURL } from "../../../index";
import classnames from "classnames";

import styles from "./emote.module.scss";

const Emotes = (props) => {
  if (props.loading) {
    return (
      <div className={classnames(styles.wrapper, "skelet-loading", props.showUsername && styles.user)}>
        <div className={styles.card}>
          <img
            style={{ minWidth: "50px" }}
            src="data:image/gif;base64,R0lGODlhAQABAPcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAABAAEAAAgEAP8FBAA7"
            alt="loading"
            className="loading"
          />
          <div>
            <span className="loading-after"></span>
            {props.showUsername && <span className="loading-after"></span>}
          </div>
        </div>
      </div>
    );
  }

  const encoded = decode(props.emote.code);

  return (
    <div className={classnames(styles.wrapper, props.showUsername && styles.user)}>
      <Link to={"/emotes/" + props.emote._id} className={styles.card} title={encoded}>
        <img src={HOSTURL + "/cached/emote/" + props.emote._id + "/2x"} alt={encoded} />
        {!props.emote.sharing && (
          <div className={styles["private-emote"]}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 237 237">
              <path d="M118.499 0c-36.31 0-65.85 29.541-65.85 65.852V105H35.417v132h166.166V105h-17.232V65.852C184.351 29.541 154.81 0 118.499 0zm14 197.666c0 7.732-6.268 14-14 14-7.731 0-14-6.268-14-14v-15.334c0-7.73 6.269-14 14-14 7.732 0 14 6.27 14 14v15.334zM154.351 105H82.649V65.852C82.649 46.084 98.731 30 118.499 30c19.769 0 35.852 16.084 35.852 35.852V105z" />
            </svg>
          </div>
        )}
        <div>
          <span>{encoded}</span>
          {props.showUsername && <span>{props.emote.user?.user_login}</span>}
          {!!props.emote.visibility_simple?.filter((t) => t === "ZERO_WIDTH").length && (
            <div className={styles["zero-width"]}> &gt; &lt; </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Emotes;
