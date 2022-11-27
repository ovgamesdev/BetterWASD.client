import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Input from "../../../components/UI/Input";
import ButtonLoading from "../../../components/UI/Loading";
import Loading from "../../../components/UI/Loading/Button";
import Modal from "../../../components/UI/Modal";
import useComponentVisible from "../../../hooks/useComponentVisible/index.tsx";
import useMeta from "../../../hooks/useMeta/index.tsx";
import api from "../../../services/api";
import DeleteItem from "./Item";

const AdminDashboardDisabledOptions = () => {
  useMeta({ title: "BetterWASYA | Admin | Отключенные опции" });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const [text, setText] = useState("");
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  const { isComponentVisible: show, setIsComponentVisible: setShow, ref } = useComponentVisible();

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const { data: res } = await api.disabledOptions.get();
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

  const onDelete = async (item) => setData(data.filter((e) => e !== item));

  const onCreate = async () => {
    if (!text.trim()) return;
    if (data.includes(text.trim())) return;
    setData([...data, text]);
    setShow(false);
    setText("");
  };

  const onSave = async () => {
    try {
      setIsLoadingUpdate(true);
      await api.disabledOptions.update(data);
      toast.success("Отключенные опции успешно изменен");
    } catch {
      toast.error("Ошибка изменения отключенныч опций");
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  return (
    <>
      <div className="item block item_right" style={{ marginTop: "0px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="item__title"> Отключенные опции </div>
          <div className="flat-btn" style={{ display: "flex" }}>
            <button onClick={() => setShow(true)} className="primary medium" disabled={isLoading}>
              Отключить опцию
            </button>
          </div>
        </div>
        <div className="item__border" />

        {error && error.message}
        {isLoading && <Loading />}

        {!isLoading && data.map((v, i) => <DeleteItem key={v._id || i} data={v} onDelete={onDelete} />)}
        <div className="flat-btn buttons" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 20 }}>
          <button onClick={onSave} disabled={isLoadingUpdate} className="primary medium" style={{ width: "300px" }}>
            {isLoadingUpdate ? <ButtonLoading /> : "Сохранить"}
          </button>
        </div>
      </div>

      <Modal isShow={show} visibleRef={ref}>
        <span>Отключить опцию</span>
        <>
          <Input
            placeholder="text"
            inputClassName={isLoading ? "disabled" : ""}
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ flexDirection: "column", alignItems: "stretch", marginTop: "5px" }}
          />

          {error && (
            <span className="error" style={{ marginTop: "5px" }}>
              {error}
            </span>
          )}
        </>
        <div className="flat-btn" style={{ display: "flex" }}>
          <button className={`medium basic ${isLoading ? "disabled" : ""}`} style={{ marginRight: "5px" }} onClick={() => setShow(false)}>
            отмена
          </button>
          <button style={{ width: "100px" }} className={`primary medium`} onClick={() => onCreate()}>
            добавить
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AdminDashboardDisabledOptions;
