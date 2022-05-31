// import React, { useState, useEffect } from "react";
// import Loading from "../../../components/UI/Loading/Line";
// import Emote from "../../../components/UI/Emote";
import useTitle from "../../hooks/useTitle";
import NavbarEmotes from "../../components/UI/Navbar/Emotes";
// import api from "../../../services/api";

// import ReactPaginate from "react-paginate";
import {
  Navigate,
  // Navigate,
  Route,
  Routes,
  // useLocation,
  // useNavigate,
  // useSearchParams,
} from "react-router-dom";

import EmotesTop from "./Top";
import EmotesShared from "./Shared";
import EmotesGlobal from "./Global";
import Emote from "./Emote";

const EmotesRoutes = () => {
  useTitle("BetterWASD | Эмоции");

  // const [isLoading, setIsLoading] = useState(true);
  // const [isFirsLoading, setIsFirsLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const [data, setData] = useState(Array(19).fill({}));

  // const navigate = useNavigate();
  // const location = useLocation();

  // useEffect(() => {

  //   document.querySelector(".wrapper")?.scrollTo({ top: 0, left: 0 });
  //   navigate(
  //     {
  //       pathname: location.pathname,
  //       search: `${page !== 1 ? "?page=" + page : ""}${
  //         search !== "" ? "&query=" + search.trim() : ""
  //       }`,
  //     },
  //     { replace: true }
  //   );
  // }, [page, search, location.pathname, navigate]);

  return (
    <section className="question-section" style={{ paddingBottom: "160px" }}>
      <div className="items">
        <div className="item item_left">
          <NavbarEmotes defaultActiveKey="#/emotes/global" />
        </div>

        <Routes>
          <Route path="top" element={<EmotesTop />} />
          <Route path="shared" element={<EmotesShared />} />
          <Route path="global" element={<EmotesGlobal />} />

          <Route path=":id" element={<Emote />} />

          <Route path="*" element={<Navigate to="/emotes/top" />} />
        </Routes>

        {/* <div className="item block item_right" style={{ marginTop: "0px" }}>
          <div className="item__title"> Глобальные эмоции </div>
          <div className="item__descr">
            Эмоции, которые можно использовать во всех чатах на WASD.TV с
            BetterWASD.
          </div>
          <div className="item__border"></div>
          <div className="emotes">
            {error && error.message}
            {isLoading && !isFirsLoading && <Loading />}
            {data.length !== 0 &&
              data.map((emote, index) => (
                <Emote
                  key={emote._id || index}
                  emote={emote}
                  loading={isFirsLoading}
                />
              ))}
            {data.length === 0 && search !== "" && <div>Здесь нет ничего</div>}
          </div>
          {total > limit && (
            <ReactPaginate
              pageCount={Math.ceil(total / limit)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              nextLabel="Следующая"
              previousLabel="Предыдущая"
              onPageChange={(e) => setPage(e.selected + 1)}
              containerClassName={"pagination justify-content-center"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              activeClassName={"active"}
              disabledClassName={"disabled"}
              initialPage={Number(page) - 1}
            />
          )}
        </div> */}
      </div>
    </section>
  );
};

export default EmotesRoutes;
