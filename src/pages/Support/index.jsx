import React from "react";

import useMeta from "../../hooks/useMeta/index.tsx";

import BoostyLogo from "./logo/boosty-white.png";
import PatreonLogo from "./logo/patreon-white.png";

const Support = () => {
  useMeta({ title: "BetterWASYA | Support" });

  return (
    <>
      <section className="main-section">
        <div className="block">
          <div className="main-title">ПОДДЕРЖАТЬ</div>
          <div className="descr">
            Оплата доменов и хостинга или просто поддержка проекта!
          </div>
          <div className="buttons">
            <a
              href="https://boosty.to/ovgames"
              target="_blank noreferrer"
              className="button button-big "
              style={{
                backgroundColor: "#F15F2C",
                boxShadow: "0 18px 30px -12px rgb(241 95 44 / 35%)",
              }}
            >
              <img
                src={BoostyLogo}
                alt="Boosty Logo"
                height={30}
                style={{ marginRight: 5 }}
              />
              Boosty
            </a>
            <a
              href="https://www.patreon.com/ovgames"
              target="_blank noreferrer"
              className="button button-big "
              style={{
                backgroundColor: "#FF424D",
                boxShadow: "0 18px 30px -12px rgb(255 66 77 / 35%)",
              }}
            >
              <img
                src={PatreonLogo}
                alt="Patreon Logo"
                height={30}
                style={{ marginRight: 5 }}
              />
              Patreon
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Support;
