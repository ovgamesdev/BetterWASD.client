import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Loading from "../../../components/UI/Loading/Button";
import ButtonLoading from "../../../components/UI/Loading";
import SubItemIcon from "../../../components/UI/SubItemIcon";

import api from "../../../services/api/index.js";
import useAuth from "../../../hooks/useAuth";
import useMeta from "../../../hooks/useMeta/index.tsx";

import "./../../user.css";

const objectMap = (obj, fn) => Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));

const DashboardSub = () => {
  useMeta({ title: "BetterWASYA | Значок подписчика" });
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);
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
  const [subIcons, setSubIcons] = useState(nullBages);
  const [savedBadges, setSavedBadges] = useState(nullBages);
  const [isPartner, setIsPartner] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: jdata } = await api.subBadge.getSubBadges(auth.editor?.user_id);
        const mappedBadges = objectMap(jdata.badges, (badge) => (badge === null ? "" : badge));
        setSubIcons(mappedBadges);
        setSavedBadges(mappedBadges);
        setIsPartner(jdata.is_partner);
      } catch (e) {
        console.log(e);
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
      global.gtag("event", "update_user_sub_badges", {
        wasd_user_id: auth.user.user_id,
        user_login: auth.user.user_login,
        badges: JSON.stringify(subIcons),
      });
    } catch {
      toast.error("Ошибка сохранения значков");
    }
    setIsLoadingUpdate(false);
  };

  const onDelete = async () => {
    setIsLoadingRemove(true);
    try {
      await api.subBadge.deleteSubBadges(auth.editor?.user_id);
      setSavedBadges(nullBages);
      setSubIcons(nullBages);
      toast.success("Значки подписчиков удалены!");
      global.gtag("event", "delete_user_sub_badges", {
        wasd_user_id: auth.user.user_id,
        user_login: auth.user.user_login,
      });
    } catch {
      toast.error("Ошибка удаления значков подписчика");
    }
    setIsLoadingRemove(false);
  };

  const [isLoadedImages, setIsLoadedImages] = useState({
    "1mon": true,
    "3mon": true,
    "6mon": true,
    "9mon": true,
    "12mon": true,
    "18mon": true,
    "24mon": true,
  });

  return (
    <div className="item block item_right" style={{ marginTop: "0px" }}>
      <div className="item__title"> Значок подписчика </div>
      <div className="item__descr">
        Значок подписчика в чате доступен пользователям с BetterWASYA.
        {/*<br></br><p style={{fontSize: '14px', color: 'var(--wasd-color-text-fourth)'}}>Выдается на месяц, после чего иконка сбросится.</p>*/}
      </div>
      <div className="item__border" />

      {isLoading ? <Loading /> : null}
      {isLoading ? null : isPartner ? (
        <div>
          <div className="item__descr">Рекомендуется размер изображения от 20 до 40px.</div>

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
              ></SubItemIcon>
            ))}
          </div>

          <br></br>

          <div className="flat-btn" style={{ display: "flex", paddingTop: "5px", flexDirection: "column", alignItems: "center" }}>
            <button
              onClick={onSave}
              disabled={isLoadingUpdate}
              className={`primary medium ${
                auth.user &&
                savedBadges &&
                !(
                  subIcons["1mon"] === savedBadges["1mon"] &&
                  subIcons["3mon"] === savedBadges["3mon"] &&
                  subIcons["6mon"] === savedBadges["6mon"] &&
                  subIcons["9mon"] === savedBadges["9mon"] &&
                  subIcons["12mon"] === savedBadges["12mon"] &&
                  subIcons["18mon"] === savedBadges["18mon"] &&
                  subIcons["24mon"] === savedBadges["24mon"]
                ) &&
                isLoadedImages["1mon"] &&
                isLoadedImages["3mon"] &&
                isLoadedImages["6mon"] &&
                isLoadedImages["9mon"] &&
                isLoadedImages["12mon"] &&
                isLoadedImages["18mon"] &&
                isLoadedImages["24mon"]
                  ? ""
                  : "disabled"
              }`}
              style={{ width: "300px" }}
            >
              {isLoadingUpdate ? <ButtonLoading /> : "Сохранить"}
            </button>

            <button
              onClick={onDelete}
              disabled={isLoadingRemove}
              className={`warning medium ${
                auth.user &&
                savedBadges &&
                savedBadges["1mon"] === "" &&
                savedBadges["3mon"] === "" &&
                savedBadges["6mon"] === "" &&
                savedBadges["9mon"] === "" &&
                savedBadges["12mon"] === "" &&
                savedBadges["18mon"] === "" &&
                savedBadges["24mon"] === ""
                  ? "disabled"
                  : ""
              }`}
              style={{ marginTop: "5px", width: "300px" }}
            >
              {isLoadingRemove ? <ButtonLoading /> : "Восстановить по умолчанию"}
            </button>
          </div>
        </div>
      ) : (
        "Эта функция доступна только для партнеров wasd.tv"
      )}
    </div>
  );
};

export default DashboardSub;
