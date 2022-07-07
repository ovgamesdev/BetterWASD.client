import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ColorPicker, { useColorPicker } from "react-best-gradient-color-picker";
import { toast } from "react-toastify";

import TabGroup from "../../../components/UI/TabGroup";
import ButtonLoading from "../../../components/UI/Loading";

import api from "../../../services/api/index.js";
import useAuth from "../../../hooks/useAuth";
import useMeta from "../../../hooks/useMeta/index.tsx";

import previewStyle from "./preview.module.scss";
import "./../../user.css";

const DashboardPaint = () => {
  useMeta({ title: "BetterWASYA | Цвет имени" });
  const navigate = useNavigate();

  const userColors = [
    "#7fba40",
    "#1c3fc8",
    "#a5276d",
    "#913ca7",
    "#4332b6",
    "#266bc5",
    "#5bc3c1",
    "#d87539",
    "#a9ad47",
    "#3ca13b",
    "#4db89a",
    "#6a4691",
    "#f5a623",
    "#e7719e",
    "#9fcbef",
    "#7b4b4b",
  ];
  const auth = useAuth();
  const [carusel, setCarusel] = useState(auth.user?.paint?.length < 5 ? Number(auth.user?.paint) : 0);
  const [color, setColor] = useState(auth.user?.paint?.length < 5 ? "rgba(255,255,255,1)" : auth.user?.paint);
  const [picker, setPicker] = useState(auth.user?.paint?.length > 5);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);

  const { setA } = useColorPicker(color, setColor);

  const onSave = async () => {
    try {
      setIsLoadingUpdate(true);
      const paint = getColor();
      await api.paint.setPaint({ paint: paint });
      auth.setUser({ ...auth.user, paint: paint.toString() });
      toast.success("Цвет успешно изменен");
    } catch {
      toast.error("Ошибка изменения цвета");
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoadingRemove(true);
      await api.paint.deletePaint();
      auth.setUser({ ...auth.user, paint: null });
      toast.success("Цвет успешно сброшен");
    } catch {
      toast.error("Ошибка удаления имени");
    } finally {
      setIsLoadingRemove(false);
    }
  };

  useEffect(() => {
    setA("100");
    if (typeof auth.editor?.user_id !== "undefined") return navigate("/dashboard/emotes");
  }, [setA, auth.editor?.user_id, navigate]);

  const getColor = () => (picker ? color : carusel);

  const calculateCarusel = (e) => {
    if (e > 21) {
      setCarusel(0);
    } else if (e < 0) {
      setCarusel(21);
    } else {
      setCarusel(e);
    }
  };

  const isEdit =
    getColor().toString() === auth.user.paint?.toString() || (getColor().toString().length > 155 && auth.user?.user_role !== "ADMIN");

  return (
    <div className="item block item_right" style={{ marginTop: "0px" }}>
      <div className="item__title"> Цвет имени </div>
      <div className="item__descr">Цвет доступен пользователям с BetterWASYA.</div>
      <div className="item__border"></div>

      <TabGroup
        onChange={(e) => setPicker(!!e)}
        active={picker ? 1 : 0}
        tabs={[{ title: "Предустановленные цвета" }, { title: "Цветовая палитра/градиент" }]}
      />

      <br></br>
      <br></br>

      <div className={previewStyle.root}>
        {!picker && (
          <button onClick={() => calculateCarusel(carusel - 1)}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"></path>
            </svg>
          </button>
        )}
        <div className={previewStyle.wrapper}>
          {getColor().toString().length < 4 && <div className={previewStyle.count}>{getColor()}</div>}

          <span className={previewStyle.message}>
            <span className={previewStyle.time}>10:00</span>
            {!picker ? (
              <span>
                <span
                  data-betterwasya-paint={carusel}
                  style={{
                    color: userColors[auth.user.user_id % (userColors.length - 1)],
                  }}
                >
                  {auth.user.user_login}
                </span>
              </span>
            ) : color?.match("gradient") ? (
              <span data-betterwasya-paint="" style={{ backgroundImage: color }}>
                {auth.user.user_login}
              </span>
            ) : (
              <span data-betterwasya-paint="" style={{ color: color }}>
                {auth.user.user_login}
              </span>
            )}
            <span className={previewStyle.text}>Предпросмотр сообщения</span>
          </span>

          {/* <span style={{padding: '5px', backgroundColor: '#f0f0f8', color: 'rgba(26, 32, 44, .88)'}}>
								<span style={{color: 'rgba(26, 32, 44, .64)', fontSize: '10px', heigth: '20px', marginRight: '8px'}}>10:00</span>
								{ !picker ? 
									<span data-betterwasya-paint={carusel} style={{color: userColors[auth.user.user_id % (userColors.length - 1)]}}>{auth.user.user_login}</span> : color?.match('gradient') ? <span data-betterwasya-paint="" style={{backgroundImage: color}}>{auth.user.user_login}</span>
								:
									<span data-betterwasya-paint="" style={{color: color}}>{auth.user.user_login}</span>
								} <span style={{margin: '10px 4px'}}>Предпросмотр сообщения</span>
							</span> */}
        </div>
        {!picker && (
          <button onClick={() => calculateCarusel(carusel + 1)}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"></path>
            </svg>
          </button>
        )}
      </div>

      <div className="wrapper__color-picker">
        {picker && (
          <div style={{ width: "300px" }} className="color-picker">
            <ColorPicker
              hidePresets={true}
              hideEyeDrop={true}
              hideColorGuide={true}
              hideInputType={true}
              value={color}
              onChange={setColor}
            />
          </div>
        )}
      </div>

      <div className="flat-btn buttons" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {getColor()?.toString().length > 155 && auth.user?.user_role !== "ADMIN" && (
          <span
            className=""
            style={{
              marginBottom: "5px",
              color: "rgba(var(--wasd-color-warning--rgb), .75)",
            }}
          >
            Вы используете большое количество цветов
          </span>
        )}
        <button
          onClick={onSave}
          disabled={isLoadingUpdate}
          className={`primary medium ${isEdit ? "disabled" : ""}`}
          style={{ width: "300px" }}
        >
          {isLoadingUpdate ? <ButtonLoading /> : "Сохранить"}
        </button>
        <button
          onClick={onDelete}
          disabled={isLoadingRemove}
          className={`warning medium ${typeof auth.user?.paint !== "string" ? "disabled" : ""}`}
          style={{ marginTop: "5px", width: "300px" }}
        >
          {isLoadingRemove ? <ButtonLoading /> : "Восстановить по умолчанию"}
        </button>
      </div>
    </div>
  );
};

export default DashboardPaint;
