import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

import Loading from "../../../components/UI/Loading/Button";

import api from "../../../services/api/index.js";
import useMeta from "../../../hooks/useMeta/index.tsx";
import PaintItem from "./Item";

import "./../../user.css";
import "./paint-item.scss";

const AdminDashboardPaint = () => {
  useMeta({ title: "BetterWASYA | Admin | Цвет имени" });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(Array(60).fill({}));

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const limit = 30 * 2;

  const [page, setPage] = useState(searchParams.get("page") ? Number(searchParams.get("page")) : 1);
  const [total, setTotal] = useState(30 * 60 * 2);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetch = async () => {
        try {
          setIsLoading(true);
          const { data: res, headers } = await api.admin.getPaints(limit, (page - 1) * limit);
          setTotal(headers.total);
          setData(res);
        } catch (e) {
          setError(e);
        } finally {
          setIsLoading(false);
          setError(null);
        }
      };
      fetch();
    }, 250);

    document.querySelector(".wrapper")?.scrollTo({ top: 0, left: 0 });
    navigate({ pathname: location.pathname, search: `${page !== 1 ? "?page=" + page : ""}` }, { replace: true });
    return () => clearTimeout(timeoutId);
  }, [page, limit, location.pathname, navigate]);

  const removeHandler = async (id, user_login) => {
    try {
      const isDelete = global.confirm(`Удалить цвет у пользователя ${user_login}`);
      if (!isDelete) return null;

      const { data: nData } = await api.admin.deletePaint(id);
      if (nData.ok) {
        toast.success("Цвет успешно удален");

        const { data: res, headers } = await api.admin.getPaints(limit, (page - 1) * limit);
        setTotal(headers.total);
        setData(res);
      } else {
        toast.error("Ошибка удаления цвета");
      }
    } catch {
      toast.error("Ошибка при удалении цвета");
    }
  };

  return (
    <div className="item block item_right" style={{ marginTop: "0px" }}>
      <div className="item__title"> Цвет имени </div>
      <div className="item__descr">Цвет доступен пользователям с BetterWASYA.</div>
      <div className="item__border" />

      {error && error.message}
      {isLoading && <Loading />}

      {!isLoading && (
        <table className="paint__table">
          <thead>
            <tr>
              <th>№</th>
              <th>Имя пользователя</th>
              <th>Созд / Изм</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {data.length !== 0 &&
              data.map((paint, index) => <PaintItem key={paint._id || index} paint={paint} removeHandler={removeHandler} />)}
          </tbody>
        </table>
      )}

      {!isLoading && total > limit && (
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

export default AdminDashboardPaint;
