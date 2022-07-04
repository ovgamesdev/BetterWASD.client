import React from "react";
import { useState } from "react";

import api from "../../../services/api/index.js";
import styles from "./../../../pages/modal.module.scss";
import { useEffect } from "react";
import GalleryItem from "./Item";
import Loading from "../Loading/Button";
import { toast } from "react-toastify";
import useComponentVisible from "../../../hooks/useComponentVisible/index.tsx";
import TabGroup from "../TabGroupV2";

import "./dropdrag-zone.scss";

const FilesGallery = ({ value, onChange, fileType, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [gallery, setGallery] = useState([]);
  const [galleryGlobal, setGalleryGlobal] = useState([]);

  const [defaultValue, setDefaultValue] = useState({ name: value, thumbnailLink: value, rawLink: value });
  const [active, setActive] = useState(defaultValue);
  const [activeTab, setActiveTab] = useState("general");

  const [drag, setDrag] = useState(false);

  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false, (is) => !is && setActive(defaultValue));

  useEffect(() => {
    const find = async () => {
      try {
        setIsLoading(true);
        setGallery([]);
        setGalleryGlobal([]);
        const { data } = await api.alertBox.getFiles(fileType);
        setGallery(data.channel);
        setGalleryGlobal(data.global);

        const item = data.global.find((i) => i.rawLink === defaultValue.rawLink);
        const itemUpload = data.channel.find((i) => i.rawLink === defaultValue.rawLink);
        item && setDefaultValue(item);
        itemUpload && setDefaultValue(itemUpload);
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    };

    find();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = async (id) => {
    try {
      const isDelete = global.confirm("Вы уверены?");
      if (!isDelete) return;

      await api.alertBox.deleteFile(fileType, id);

      setGallery(gallery.filter((g) => g.id !== id));
      toast.success("Файл удален");
    } catch (e) {
      toast.error("Ошибка удаления");
    }
  };

  const dragStartHandler = (e) => {
    e.preventDefault();
    setDrag(true);
  };
  const dragLeaveHandler = (e) => {
    e.preventDefault();
    setDrag(false);
  };

  const onDropHandler = (e) => {
    e.preventDefault();
    upload(e.dataTransfer.files[0]);
    setDrag(false);
  };

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append(fileType, file);

      const { data } = await api.alertBox.uploadFile(fileType, formData);

      setGallery([...gallery, data]);

      toast.success("Файл загружен!");
    } catch (e) {
      toast.error("Мы не можем загрузить этот файл.");
    }
  };

  return (
    <>
      <div className="preview">
        <div
          className="img"
          style={{
            backgroundImage: `url(${defaultValue.thumbnailLink})`,
          }}
        ></div>
        <div className="wasd-input-wrapper" ovg="">
          <div ovg="" className="wasd-input">
            <input
              onClick={() => setIsComponentVisible(true)}
              ovg=""
              style={{ margin: 0 }}
              value={defaultValue.name}
              readOnly
              placeholder={`https://example.com/${fileType}`}
            />
          </div>
        </div>
      </div>

      {isComponentVisible && <ovg-modal-backdrop></ovg-modal-backdrop>}
      {isComponentVisible && (
        <ovg-modal-window data-show="show" className={styles["show"]}>
          <div className={styles["modal-block"] + " " + styles["modal-block_medium"]} style={{ width: "440px" }} ref={ref}>
            <div className={styles["modal-block__title"]}>
              <span> {title} </span>
            </div>

            <div
              className={styles["modal-block__content"]}
              style={{ padding: "0 24px", minHeight: "400px", display: "flex", flexDirection: "column" }}
            >
              <TabGroup
                style={{ width: "100%", paddingTop: "10px" }}
                active="upload"
                onChange={(e) => setActiveTab(e.value)}
                tabs={[
                  { label: "Общие", value: "general" },
                  { label: "Загрузки", value: "upload" },
                ]}
              />

              {activeTab === "general" && (
                <>
                  <div className="emotes">
                    {isLoading && <Loading />}
                    {galleryGlobal.map((i) => (
                      <GalleryItem data={i} key={i.id} onSelect={setActive} onDelete={onDelete} />
                    ))}
                  </div>
                </>
              )}
              {activeTab === "upload" && (
                <>
                  <div className="asset-dragdrop">
                    <div className="asset-dragdrop-zone" style={{}}>
                      {drag ? (
                        <div
                          onDragStart={(e) => dragStartHandler(e)}
                          onDragLeave={(e) => dragLeaveHandler(e)}
                          onDragOver={(e) => dragStartHandler(e)}
                          onDrop={(e) => onDropHandler(e)}
                          className="dropdrag__zone"
                        >
                          Опустите файл, чтобы загрузить его
                        </div>
                      ) : (
                        <div
                          onDragStart={(e) => dragStartHandler(e)}
                          onDragLeave={(e) => dragLeaveHandler(e)}
                          onDragOver={(e) => dragStartHandler(e)}
                          className="dropdrag__zone-button"
                        >
                          Перетащите файл, чтобы загрузить его
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="emotes">
                    {isLoading && <Loading />}
                    {gallery.map((i) => (
                      <GalleryItem data={i} key={i.id} onSelect={setActive} onDelete={onDelete} />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className={styles["modal-block__footer"]}>
              <div className="flat-btn ovg" style={{ display: "flex" }}>
                <button
                  className={`medium ovg basic hide ${isLoading ? "disabled" : ""}`}
                  style={{ marginRight: "5px" }}
                  onClick={() => {
                    setActive(defaultValue);
                    setIsComponentVisible(false);
                  }}
                >
                  отмена
                </button>
                <button
                  style={{ width: "141.2px" }}
                  className={`primary medium ovg basic hide ${isLoading ? "disabled" : ""}`}
                  onClick={() => {
                    onChange(active.rawLink);
                    setDefaultValue(active);
                    setIsComponentVisible(false);
                  }}
                >
                  выбрать
                </button>
              </div>
            </div>
          </div>
        </ovg-modal-window>
      )}
    </>
  );
};

export default FilesGallery;
