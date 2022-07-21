import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const Pagination = ({ page, total, search, limit, setPage }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    navigate({ pathname: location.pathname, search: `${page !== 1 ? "?page=" + page : ""}${search !== "" ? "&query=" + search.trim() : ""}` }, { replace: true });
    document.querySelector(".wrapper")?.scrollTo({ top: 0, left: 0 });
  }, [page, search, location.pathname, navigate]);

  return (
    <>
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
    </>
  );
};

export default Pagination;
