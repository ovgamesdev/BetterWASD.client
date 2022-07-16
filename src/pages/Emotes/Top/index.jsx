import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

import Loading from "../../../components/UI/Loading/Line";
import Emote from "../../../components/UI/Emote";

import api from "../../../services/api/index.js";
import useMeta from "../../../hooks/useMeta/index.tsx";

const EmotesTop = () => {
  useMeta({ title: "BetterWASYA | Топ эмоций" });

  const [isLoading, setIsLoading] = useState(true);
  const [isFirsLoading, setIsFirsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(Array(60).fill({}));

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const limit = 30 * 2;

  const [page, setPage] = useState(searchParams.get("page") ? Number(searchParams.get("page")) : 1);
  const [total, setTotal] = useState(30 * 60 * 2);

  const [search, setSearch] = useState(searchParams.get("query") ? searchParams.get("query") : "");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetch = async () => {
        try {
          setIsLoading(true);
          const { data: res, headers } = await api.emote.getTopEmotes(limit, (page - 1) * limit, search.trim());
          setTotal(headers.total);
          setData(res);
        } catch (e) {
          setError(e);
        } finally {
          setIsLoading(false);
          setIsFirsLoading(false);
          setError(null);
        }
      };
      fetch();
    }, 250);

    document.querySelector(".wrapper")?.scrollTo({ top: 0, left: 0 });
    navigate(
      {
        pathname: location.pathname,
        search: `${page !== 1 ? "?page=" + page : ""}${search !== "" ? "&query=" + search.trim() : ""}`,
      },
      { replace: true }
    );
    return () => clearTimeout(timeoutId);
  }, [search, page, limit, location.pathname, navigate]);

  return (
    <div className="item block item_right" style={{ marginTop: "0px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {search === "" && <div className="item__title"> Топ эмоции </div>}
        {search !== "" && <div className="item__title"> Топ эмоции: {search} </div>}
        <div className="flat-btn" style={{ display: "flex" }}>
          <wasd-input>
            <div className="wasd-input-wrapper" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <div className="wasd-input search-container">
                <input
                  style={{ margin: "0" }}
                  placeholder="Поиск.."
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value.replace(/[^а-яА-Яa-zA-Z0-9]+/g, ""));
                    setPage(1);
                  }}
                />
                <svg className="search" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="currentColor"
                    d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                  />
                </svg>
              </div>
              {error && (
                <span className="error" style={{ marginTop: "5px" }}>
                  {error}
                </span>
              )}
            </div>
          </wasd-input>
        </div>
      </div>

      <div className="item__descr">Лучшие общие эмоции на всем BetterWASYA.</div>
      <div className="item__border" />
      <div className="emotes">
        {error && error.message}
        {isLoading && !isFirsLoading && <Loading />}
        {data.length !== 0 &&
          data.map((emote, index) => <Emote showUsername={true} key={emote._id || index} emote={emote} loading={isFirsLoading} />)}
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
          containerClassName="pagination justify-content-center"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          activeClassName="active"
          disabledClassName="disabled"
          initialPage={Number(page) - 1}
        />
      )}
    </div>
  );
};

export default EmotesTop;
