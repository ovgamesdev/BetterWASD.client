import React from "react";
import { Link } from "react-router-dom";
import ButtonLoading from "../Loading";

import styles from "./editor-user.module.scss";

const EditorUser = (props) => {
  if (props.loading) {
    return (
      <div className={styles.root + " skelet-loading"}>
        <div>
          <img
            width={34}
            height={34}
            src="data:image/gif;base64,R0lGODlhAQABAPcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAABAAEAAAgEAP8FBAA7"
            alt="profile"
            className="loading"
          />
          <div style={{ width: "90px", height: "16px", marginLeft: "5px" }} className="loading" />
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            marginRight: "5px",
          }}
        >
          <div style={{ height: "24px", width: "24px" }} className="loading" />
        </div>
      </div>
    );
  }

  const user = props.user.user || props.user.editor;

  return (
    <div className={styles.root + " flat-btn"}>
      <div style={{ marginRight: "auto" }}>
        <img width={34} height={34} src={user.channel_image} alt="avatar" />
        <Link to={"/users/" + user.user_id} className={styles.user_login}>
          {user.user_login}
        </Link>
      </div>
      {typeof props.isLoadingRemove !== "undefined" && (
        <button
          onClick={() => props.deleteEditor(user.user_id)}
          disabled={props.isLoadingRemove === user.user_id}
          className="warning small"
          style={{ width: "24px", marginRight: "5px" }}
        >
          {props.isLoadingRemove === user.user_id ? <ButtonLoading /> : "x"}
        </button>
      )}
    </div>
  );
};

export default EditorUser;
