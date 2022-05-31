import React from "react";
import useTitle from "../hooks/useTitle";

const NotFound = () => {
  useTitle("BetterWASD | Ошибка 404");
  return (
    <div className="notFound">
      <h1> 404 </h1>
      <p>
        Ошибка 404 страница не найдена. Наверное она была удалена или
        перемещена… А может ее и не было.
      </p>
    </div>
  );
};

export default NotFound;
