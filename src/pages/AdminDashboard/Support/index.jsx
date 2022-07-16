import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Loading from "../../../components/UI/Loading/Button";
import useMeta from "../../../hooks/useMeta/index.tsx";
import api from "../../../services/api";
import SupportItem from "./Item";

const AdminDashboardBell = () => {
  useMeta({ title: "BetterWASYA | Admin | Обратная связь" });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const { data: res } = await api.support.getAll();
        setData(res);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
        setError(null);
      }
    };
    fetch();
  }, []);

  const onDelete = async (support) => {
    if (!support._id) return setData(data.filter((b) => b.text !== support.text));

    try {
      const isDelete = global.confirm(`Удалить уведомление?`);
      if (!isDelete) return null;

      const { data: nData } = await api.support.delete(support._id);
      if (nData.ok) {
        toast.success("Уведомление успешно удалено");
        setData(data.filter((b) => b._id !== support._id));
      } else {
        toast.error("Ошибка удаления уведомления");
      }
    } catch {
      toast.error("Ошибка при удалении уведомления");
    }
  };

  const onChange = async (support, status, response) => {
    try {
      await api.support.update(support._id, { status: status, message: response });
      toast.success("Ответ успешно отравлен");
    } catch {
      toast.error("Ошибка отправки ответа");
    }
  };

  return (
    <div className="item block item_right" style={{ marginTop: "0px" }}>
      <div className="item__title"> Обратная связь </div>
      <div className="item__descr"> Обратная связь BetterWASYA. </div>
      <div className="item__border" />

      {error && error.message}
      {isLoading && <Loading />}

      {!isLoading && data.map((info, i) => <SupportItem key={info._id || i} data={info} onDelete={onDelete} onChange={onChange} />)}
    </div>
  );
};

export default AdminDashboardBell;
