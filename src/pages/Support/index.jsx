import React from "react";
import ReactTooltip from "react-tooltip";

import useMeta from "../../hooks/useMeta/index.tsx";

import BoostyLogo from "./logo/boosty-white.png";
import PatreonLogo from "./logo/patreon-white.png";

import "./index.scss";

const Support = () => {
  useMeta({ title: "BetterWASYA | Support" });

  return (
    <>
      <section className="main-section">
        <div className="block">
          <div className="main-title">ПОДДЕРЖАТЬ</div>
          <div className="descr">
            Оплата доменов и хостинга или просто поддержка проекта!
            <div data-tip="нужно имя пользователя">А также дополнительные возможности в будущем.</div>
          </div>
          <ReactTooltip />
          <div className="buttons">
            <a href="https://boosty.to/ovgames" target="_blank noreferrer" className="button button-big boosty">
              <img src={BoostyLogo} alt="Boosty Logo" />
              Boosty
            </a>
            <a href="https://www.patreon.com/ovgames" target="_blank noreferrer" className="button button-big patreon">
              <img src={PatreonLogo} alt="Patreon Logo" />
              Patreon
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Support;
