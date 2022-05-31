import React from "react";
import { useSearchParams } from "react-router-dom";
import "react-slideshow-image/dist/styles.css";
// import ButtonLoading from "../components/UI/Loading";
// import api from "../services/api";

const XsollaCallback = () => {
  // const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();

  return (
    <section className="main-section">
      <div className="block">
        {/* <div className="main-title">Платная подписка на BetterWASD</div> */}
        <div className="descr">
          {/* Получите собственные эмоции и значек подписчика. */}
          {searchParams.get("invoice_id") !== "" ? "успешно" : "отменено"}
        </div>
        <div className="buttons">
          {/*<button className="button-big white">twast</button>*/}
        </div>
      </div>
    </section>
  );
};

export default XsollaCallback;
