import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Loading from "../../../components/UI/Loading/Button";
import ButtonLoading from "../../../components/UI/Loading";
import SubItemIcon from "../../../components/UI/SubItemIcon";

import api from "../../../services/api/index.js";
import useAuth from "../../../hooks/useAuth";
import useMeta from "../../../hooks/useMeta/index.tsx";
import isEqual from "../../../lib/isEqual";

import "./../../user.css";

const objectMap = (obj, fn) => Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));
const defBadges = {
  "1mon": "https://static.wasd.tv/images/subscribers/1mon.png",
  "3mon": "https://static.wasd.tv/images/subscribers/3mon.png",
  "6mon": "https://static.wasd.tv/images/subscribers/6mon.png",
  "9mon": "https://static.wasd.tv/images/subscribers/9mon.png",
  "12mon": "https://static.wasd.tv/images/subscribers/12mon.png",
  "18mon": "https://static.wasd.tv/images/subscribers/18mon.png",
  "24mon": "https://static.wasd.tv/images/subscribers/24mon.png",
};
const nullBages = {
  "1mon": "",
  "3mon": "",
  "6mon": "",
  "9mon": "",
  "12mon": "",
  "18mon": "",
  "24mon": "",
};
const allLoaded = {
  "1mon": true,
  "3mon": true,
  "6mon": true,
  "9mon": true,
  "12mon": true,
  "18mon": true,
  "24mon": true,
};

const DashboardSub = () => {
  useMeta({ title: "BetterWASYA | Значок подписчика" });
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);
  const [subIcons, setSubIcons] = useState(nullBages);
  const [savedBadges, setSavedBadges] = useState(nullBages);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const { data: jdata } = await api.subBadge.getSubBadges(auth.editor?.user_id);
        const mappedBadges = objectMap(jdata.badges, (badge) => (badge === null ? "" : badge));
        setSubIcons(mappedBadges);
        setSavedBadges(mappedBadges);
      } catch (e) {
        setError(e.response.data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [auth.editor?.user_id]);

  const onSave = async () => {
    try {
      setIsLoadingUpdate(true);
      await api.subBadge.setSubBadges({ badges: subIcons }, auth.editor?.user_id);
      setSavedBadges(subIcons);
      toast.success("Значки подписчика сохранены!");
      global.gtag("event", "update_user_sub_badges", { wasd_user_id: auth.user.user_id, user_login: auth.user.user_login, badges: JSON.stringify(subIcons) });
    } catch (e) {
      if (e.response.data.code === "NOT_ACCESS") {
        toast.error("Нет доступа");
      } else {
        toast.error("Ошибка сохранения значков");
      }
    }
    setIsLoadingUpdate(false);
  };

  const onDelete = async () => {
    if (!global.confirm("Вы уверены?")) return;
    try {
      setIsLoadingRemove(true);
      await api.subBadge.deleteSubBadges(auth.editor?.user_id);
      setSavedBadges(nullBages);
      setSubIcons(nullBages);
      toast.success("Значки подписчиков удалены!");
      global.gtag("event", "delete_user_sub_badges", { wasd_user_id: auth.user.user_id, user_login: auth.user.user_login });
    } catch (e) {
      if (e.response.data.code === "NOT_ACCESS") {
        toast.error("Нет доступа");
      } else {
        toast.error("Ошибка удаления значков подписчика");
      }
    }
    setIsLoadingRemove(false);
  };

  const [isLoadedImages, setIsLoadedImages] = useState(allLoaded);

  return (
    <div className="item block item_right" style={{ marginTop: "0px" }}>
      <div className="item__title"> Значок подписчика </div>
      <div className="item__descr">Значок подписчика в чате доступен пользователям с BetterWASYA.</div>
      <div className="item__border" />

      {isLoading && <Loading />}
      {!(isLoading || error) && error?.code !== "NOT_PARTNER" && (
        <>
          <div className="item__descr">Рекомендуется размер изображения 36x36px.</div>

          <div className="bonuses__icons">
            {Object.keys(subIcons).map((key, index) => (
              <SubItemIcon
                index={index}
                item={key}
                subIcons={subIcons}
                defBadges={defBadges}
                setIsLoadedImages={setIsLoadedImages}
                isLoadedImages={isLoadedImages}
                setSubIcons={setSubIcons}
                key={index}
              />
            ))}
          </div>

          <br />

          <div className="flat-btn" style={{ display: "flex", paddingTop: "5px", flexDirection: "column", alignItems: "center" }}>
            <button
              onClick={onSave}
              disabled={isLoadingUpdate}
              className={`primary medium ${auth.user && savedBadges && !isEqual(subIcons, savedBadges) && isEqual(allLoaded, isLoadedImages) ? "" : "disabled"}`}
              style={{ width: "300px" }}
            >
              {isLoadingUpdate ? <ButtonLoading /> : "Сохранить"}
            </button>

            <button
              onClick={onDelete}
              disabled={isLoadingRemove}
              className={`warning medium ${auth.user && savedBadges && isEqual(nullBages, savedBadges) ? "disabled" : ""}`}
              style={{ marginTop: "5px", width: "300px" }}
            >
              {isLoadingRemove ? <ButtonLoading /> : "Восстановить по умолчанию"}
            </button>
          </div>
        </>
      )}

      {!isLoading && error?.code === "NOT_PARTNER" && "Эта функция доступна только для партнеров wasd.tv"}

      {error?.code !== "NOT_PARTNER" && error?.code}
    </div>
  );
};

export default DashboardSub;
