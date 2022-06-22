import React, { useState, useEffect } from "react";
import Loading from "../../../components/UI/Loading/Line";
import Emote from "../../../components/UI/Emote";
import useTitle from "../../../hooks/useTitle/index.tsx";
import api from "../../../services/api";

import ReactPaginate from "react-paginate";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const EmotesGlobal = () => {
  useTitle("BetterWASYA | Глобальные эмоции");

  const [isLoading, setIsLoading] = useState(true);
  const [isFirsLoading, setIsFirsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(Array(22).fill({}));

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const limit = 30 * 2;

  const [page, setPage] = useState(searchParams.get("page") ? Number(searchParams.get("page")) : 1);
  const [total, setTotal] = useState(19);

  const [search] = useState(searchParams.get("query") ? searchParams.get("query") : "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: res, headers } = await api.emote.getGlobalEmotes();
        setTotal(headers.total);
        setData(res);
      } catch (e) {
        console.log(e);
        setError(e);
      } finally {
        setIsLoading(false);
        setIsFirsLoading(false);
        setError(null);
      }
    };

    fetchData();
    document.querySelector(".wrapper")?.scrollTo({ top: 0, left: 0 });
    navigate(
      {
        pathname: location.pathname,
        search: `${page !== 1 ? "?page=" + page : ""}${search !== "" ? "&query=" + search.trim() : ""}`,
      },
      { replace: true }
    );
  }, [page, search, location.pathname, navigate]);

  return (
    <div className="item block item_right" style={{ marginTop: "0px" }}>
      <div className="item__title"> Глобальные эмоции </div>
      <div className="item__descr">Эмоции, которые можно использовать во всех чатах на WASD.TV с BetterWASYA.</div>
      <div className="item__border"></div>
      <div className="emotes">
        {error && error.message}
        {isLoading && !isFirsLoading && <Loading />}
        {data.length !== 0 && data.map((emote, index) => <Emote key={emote._id || index} emote={emote} loading={isFirsLoading} />)}
        {data.length === 0 && search !== "" && <div>Здесь нет ничего</div>}
      </div>
      {total > limit && (
        <ReactPaginate
          pageCount={Math.ceil(total / limit)}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          nextLabel=">"
          previousLabel="<"
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
    </div>
  );
};

export default EmotesGlobal;
