import { useEffect, useState } from "react";

import useComponentVisible from "../../../hooks/useComponentVisible/index.tsx";
import BellItem from "./Item";
import api from "../../../services/api";

import notifications_svg from "./svg/notifications.svg";
import "./bell.scss";

const Bell = () => {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false, (is) => !is && updateNotifyReaded());
  const [isClick, setIsClick] = useState(false);
  const [bells, setBells] = useState([]);

  const updateNotifyReaded = () => {
    if (isClick) localStorage["notify-readed"] = bells.map((bell) => bell._id + "&").join("");
    setIsClick(false);
  };

  const isNotifyReaded = () => {
    let notifyReaded = localStorage["notify-readed"];
    let is = true;
    let newNotices = {};
    if (!notifyReaded) notifyReaded = "";
    for (let bell of bells) {
      let isR = !notifyReaded.match(bell._id);
      newNotices[bell._id] = isR;
      if (isR) {
        is = false;
      }
    }
    return { is: is, new: newNotices };
  };
  const isBellReaded = isNotifyReaded();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.bells.get();
      setBells(data);
    };

    fetchData();
  }, []);

  return (
    <div className="bell" ref={ref}>
      <div
        className={`bell__icon-wrap ${isBellReaded.is ? "" : "bell__icon-wrap--new-msg"}`}
        onClick={() => {
          setIsComponentVisible(!isComponentVisible);
          setIsClick(true);
        }}
      >
        <img className="bell__icon" src={notifications_svg} alt="notifications" />
      </div>

      {isComponentVisible && (
        <div className="bell__info bell-info">
          <div className="bell-info__title">Уведомления</div>
          <div className="bell-info__hr" />
          <div className="bell-info__list bell-info__list--scroll">
            {bells.map((bell) => (
              <BellItem
                key={bell._id}
                text={bell.text}
                link={bell.link}
                linkText={bell.linkText}
                date={bell.date}
                onClose={() => setIsComponentVisible(false)}
                isNew={isBellReaded?.new && isBellReaded?.new[bell?._id]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bell;
