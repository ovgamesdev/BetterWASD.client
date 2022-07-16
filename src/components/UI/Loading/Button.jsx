import React from "react";

import styles from "./loader.module.scss";

const Loading = () => {
  return (
    <div className={styles.root}>
      <div className={styles.normal} />
    </div>
  );
};

export default Loading;
