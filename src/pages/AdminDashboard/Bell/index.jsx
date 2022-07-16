import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../../components/UI/Loading/Button";
import useMeta from "../../../hooks/useMeta/index.tsx";
import api from "../../../services/api";
import BellItem from "./Item";

const AdminDashboardBell = () => {
  useMeta({ title: "BetterWASYA | Admin | Уведовления" });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const { data: res } = await api.bells.getAll();
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

  const onDelete = async (bell) => {
    if (!bell._id) return setData(data.filter((b) => b.text !== bell.text));

    try {
      const isDelete = global.confirm(`Удалить уведомление?`);
      if (!isDelete) return null;

      const { data: nData } = await api.bells.delete(bell._id);
      if (nData.ok) {
        toast.success("Уведомление успешно удалено");
        setData(data.filter((b) => b._id !== bell._id));
      } else {
        toast.error("Ошибка удаления уведомления");
      }
    } catch {
      toast.error("Ошибка при удалении уведомления");
    }
  };
  const onChange = async (bell) => {
    if (!bell._id) {
      try {
        const { data: res } = await api.bells.create(bell);
        setData((data) => data.filter((b) => b.text !== ""));
        setData((data) => [...data, res]);
        toast.success("Уведомление успешно создано");
      } catch {
        toast.error("Ошибка создания уведомления");
      }
    }

    if (bell._id) {
      try {
        const { data: res } = await api.bells.update(bell._id, bell);
        setData(data.map((b) => (b._id === bell._id ? res : b)));
        toast.success("Уведомление успешно изменено");
      } catch {
        toast.error("Ошибка изменения уведомления");
      }
    }
  };
  const onCreate = async () => setData([...data, { text: "", link: "", linkText: "", version: "site", date: new Date() }]);

  return (
    <div className="item block item_right" style={{ marginTop: "0px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="item__title"> Уведомления </div>
        <div className="flat-btn" style={{ display: "flex" }}>
          <button onClick={onCreate} className="primary medium" disabled={isLoading}>
            Создать уведомление
          </button>
        </div>
      </div>
      <div className="item__descr"> Уведовления BetterWASYA. </div>
      <div className="item__border" />

      {error && error.message}
      {isLoading && <Loading />}

      {!isLoading && data.map((bell, i) => <BellItem key={bell._id || i} data={bell} onDelete={onDelete} onChange={onChange} />)}
    </div>
  );
};

export default AdminDashboardBell;
