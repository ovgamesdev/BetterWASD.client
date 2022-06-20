import React from "react";
import { Link } from "react-router-dom";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const Home = () => {
  const slideImages = [
    {
      url: "https://raw.githubusercontent.com/ovgamesdev/res/main/Screenshot%20_1.png",
    },
    {
      url: "https://raw.githubusercontent.com/ovgamesdev/res/main/Screenshot%20_2.png",
    },
    {
      url: "https://raw.githubusercontent.com/ovgamesdev/res/main/Screenshot%20_3.png",
    },
  ];

  return (
    <>
      <section className="main-section">
        <div className="block">
          <div className="main-title">Набор для улучшения WASD.TV</div>
          <div className="descr">
            Получите собственные эмоции и множество новых функций, без которых
            вы никогда не захотите обойтись.
          </div>
          <div className="buttons">
            <a
              href="https://chrome.google.com/webstore/detail/cokaeiijnnpcfaoehijmdfcgbkpffgbh"
              target="_blank noreferrer"
              className="button button-big blue"
            >
              Скачать для Google Chrome
            </a>
            {/*<button className="button-big white">twast</button>*/}
          </div>
        </div>

        <div className="slideshow-container">
          <Slide>
            {slideImages.map((slideImage, index) => (
              <div className="each-slide" key={index}>
                <div
                  className="slideshow-img"
                  style={{ backgroundImage: `url(${slideImage.url})` }}
                ></div>
              </div>
            ))}
          </Slide>
        </div>
      </section>

      <footer>
        <Link to="terms">Terms of Service</Link>
        {" • "}
        <Link to="privacy">Privacy Policy</Link>
      </footer>
    </>
  );
};

export default Home;
