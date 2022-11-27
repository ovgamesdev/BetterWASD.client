import React from "react";
import { Link } from "react-router-dom";
import { Slide } from "react-slideshow-image";

import useMeta from "../../hooks/useMeta/index.tsx";

import "react-slideshow-image/dist/styles.css";

const Home = () => {
  useMeta({ title: "BetterWASYA" });

  const slideImages = [
    { url: "https://raw.githubusercontent.com/ovgamesdev/res/main/Screenshot%20_1.png" },
    { url: "https://raw.githubusercontent.com/ovgamesdev/res/main/Screenshot%20_2.png" },
    { url: "https://raw.githubusercontent.com/ovgamesdev/res/main/Screenshot%20_3.png" },
  ];

  return (
    <>
      <section className="main-section">
        <div className="block">
          <div className="main-title">Набор для улучшения WASD.TV</div>
          <div className="descr">Получите собственные эмоции и множество новых функций, без которых вы никогда не захотите обойтись.</div>
          <div className="buttons">
            <a href="https://chrome.google.com/webstore/detail/cokaeiijnnpcfaoehijmdfcgbkpffgbh" target="_blank noreferrer" className="button button-big blue">
              Скачать для Google Chrome
            </a>
            <a href="https://addons.mozilla.org/ru/firefox/addon/betterwasya/" target="_blank noreferrer" className="button button-big blue">
              Firefox
            </a>
          </div>
        </div>

        <div className="slideshow-container">
          <Slide>
            {slideImages.map((slideImage, index) => (
              <div className="each-slide" key={index}>
                <div className="slideshow-img" style={{ backgroundImage: `url(${slideImage.url})` }} />
              </div>
            ))}
          </Slide>
        </div>
      </section>

      <footer>
        <Link to="terms">Terms of Service</Link>
        {" • "}
        <Link to="privacy">Privacy Policy</Link>
        {" • "}
        <Link to="support_ovgames">Support OvGames</Link>
      </footer>
    </>
  );
};

export default Home;
