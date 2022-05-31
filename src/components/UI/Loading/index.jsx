import React from "react";

import styles from "./loader.module.scss";

const ButtonLoading = (props) => {
  return (
    <div style={props.style} className={styles.root}>
      <div className={styles.small}></div>
    </div>
  );
};

export default ButtonLoading;
