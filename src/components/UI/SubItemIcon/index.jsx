import FilesGallery from "../FilesGallery";
import subStyle from "./sub.module.scss";

const TabGroup = ({ subIcons, defBadges, setIsLoadedImages, isLoadedImages, setSubIcons, item }) => {
  const title = {
    "1mon": "1 мес.",
    "3mon": "3 мес.",
    "6mon": "6 мес.",
    "9mon": "9 мес.",
    "12mon": "1 г.",
    "18mon": "1,5 г.",
    "24mon": "2 г.",
  };

  return (
    <div className={`${subStyle.item} ${isLoadedImages[item] ? "" : "warning"}`}>
      <img
        width={20}
        height={20}
        src={subIcons[item] || defBadges[item]}
        onLoad={() => setIsLoadedImages({ ...isLoadedImages, [item]: true })}
        onError={() => setIsLoadedImages({ ...isLoadedImages, [item]: false })}
        alt="avatar"
      />
      <span style={{ minWidth: "50px" }}>{title[item]}</span>
      <FilesGallery
        style={{ width: "100%" }}
        isInputOnly
        value={{ name: subIcons[item] || "", thumbnailLink: subIcons[item] || "", rawLink: subIcons[item] || "" }}
        title="Галерея изображений"
        title_link="Ссылка на изображение"
        fileType="images"
        fileAccept=".jpg,.png,.gif,.jpeg,.svg,.webm,.mp4"
        onChange={(value) => setSubIcons({ ...subIcons, [item]: value.raw })}
      />
    </div>
  );
};

export default TabGroup;
