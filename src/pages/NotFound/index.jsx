import React from "react";

import useMeta from "../../hooks/useMeta/index.tsx";

import styles from "./notfound.module.scss";

const NotFound = () => {
  useMeta({ title: "BetterWASYA | Ошибка 404" });

  return (
    <div className={styles.not_found}>
      <h1 className={styles["not_found-text"]}> 404 </h1>
      <p>Ошибка 404 страница не найдена. Наверное она была удалена или перемещена… А может ее и не было.</p>
    </div>
  );
};

export default NotFound;
