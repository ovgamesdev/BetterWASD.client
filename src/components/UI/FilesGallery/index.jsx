import React, { useRef } from "react";
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
import "./files-gallery.scss";

import play_svg from "./svg/play.svg";
import pause_svg from "./svg/pause.svg";

import link_svg from "./svg/link.svg";
import close_svg from "./svg/close.svg";
import file_upload_svg from "./svg/file_upload.svg";

import image_svg from "./svg/image.svg";
import sound_svg from "./svg/music_note.svg";

const FilesGallery = ({ value, onChange, fileType, title, title_link, fileAccept, sound_volume }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [gallery, setGallery] = useState([]);
  const [galleryGlobal, setGalleryGlobal] = useState([]);

  const [defaultValue, setDefaultValue] = useState({ name: value, thumbnailLink: value, rawLink: value });
  const [active, setActive] = useState(defaultValue);
  const [activeTab, setActiveTab] = useState("general");
  const [linkValue, setLinkValue] = useState("");
  const [linkValueError, setLinkValueError] = useState(true);

  const [drag, setDrag] = useState(false);
  const [isPlayed, setIsPlayed] = useState(false);

  const inputFile = useRef(null);
  const toastId = useRef(null);

  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false, (is) => !is && setActive(defaultValue));
  const { ref: refLinkVisible, isComponentVisible: isLinkVisible, setIsComponentVisible: setIsLinkVisible } = useComponentVisible(false);

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

  useEffect(() => {
    return () => {
      if (isPlayed) isPlayed.pause();
    };
  }, [isPlayed]);

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

  const onUpload = (e) => {
    e.preventDefault();
    upload(e.target.files[0]);
    setDrag(false);
  };

  const upload = async (file) => {
    if (toastId.current) return toast.error("Последний файл не загружен...");

    try {
      toastId.current = toast.loading("Загрузка файла...");

      const formData = new FormData();
      formData.append(fileType, file);

      const { data } = await api.alertBox.uploadFile(fileType, formData);

      setGallery([...gallery, data]);

      toast.update(toastId.current, { render: "Файл загружен!", type: "success", isLoading: false, autoClose: 5000 });
    } catch (e) {
      if (e.response.data.code === "LIMIT_FILE_SIZE") {
        toast.update(toastId.current, { render: "Размер файла превысил 2,5 Мб.", type: "error", isLoading: false, autoClose: 5000 });
      } else {
        toast.update(toastId.current, { render: "Мы не можем загрузить этот файл.", type: "error", isLoading: false, autoClose: 5000 });
      }
    }

    toastId.current = null;
  };

  return (
    <>
      <div className="preview">
        {fileType === "images" && (
          <div className="img" style={{ backgroundImage: `url(${defaultValue.thumbnailLink || image_svg})` }}></div>
        )}
        {fileType === "sounds" && (
          <div className="flat-btn">
            <button
              className="medium primary"
              onClick={() => {
                if (isPlayed) {
                  isPlayed.pause();
                  return setIsPlayed(false);
                }
                const audio = new Audio(active.rawLink);
                audio.volume = sound_volume / 100;
                setIsPlayed(audio);
                audio.play();
                audio.onended = () => setIsPlayed(false);
                audio.onerror = () => {
                  setIsPlayed(false);
                  toast.error("Мы не можем воспроизвести этот звук");
                };
              }}
            >
              <img
                referrerPolicy="no-referrer"
                width={30}
                height={30}
                src={isPlayed ? pause_svg : play_svg}
                alt={isPlayed ? "pause" : "play"}
              />
            </button>
          </div>
        )}

        <div className="wasd-input-wrapper">
          <div className="wasd-input">
            <input
              style={{ margin: 0, paddingRight: "100px" }}
              value={defaultValue.name}
              readOnly
              disabled
              placeholder={`https://example.com/${fileType}`}
            />
            <div className="picker__controls">
              <img
                width={20}
                className="picker-item"
                src={link_svg}
                alt={"link"}
                title={"Link " + fileType}
                onClick={() => setIsLinkVisible(true)}
              />
              {defaultValue.rawLink !== "" && (
                <img
                  width={20}
                  className="picker-item"
                  src={close_svg}
                  alt={"close"}
                  title={"Remove " + fileType}
                  onClick={() => {
                    onChange("");
                    setDefaultValue({ name: "", thumbnailLink: "", rawLink: "" });
                  }}
                />
              )}
              <img
                width={20}
                className="picker-item"
                src={file_upload_svg}
                alt={"file_upload"}
                title={"Select " + fileType}
                onClick={() => setIsComponentVisible(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {(isComponentVisible || isLinkVisible) && <modal-backdrop></modal-backdrop>}
      {isComponentVisible && (
        <modal-window data-show="show" className={styles["show"]}>
          <div className={styles["modal-block"] + " " + styles["modal-block_medium"]} style={{ width: "440px" }} ref={ref}>
            <div className={styles["modal-block__title"]}>
              <span> {title} </span>
            </div>

            <div
              className={styles["modal-block__content"] + " files-gallery"}
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
                      <GalleryItem
                        active={active}
                        sound_volume={sound_volume}
                        data={i}
                        key={i.id}
                        onSelect={setActive}
                        onDelete={onDelete}
                      />
                    ))}
                  </div>
                </>
              )}
              {activeTab === "upload" && (
                <>
                  <input type="file" accept={fileAccept} ref={inputFile} style={{ display: "none" }} onChange={onUpload} />
                  <div className="asset-dragdrop">
                    <div className="asset-dragdrop-zone">
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
                          onClick={() => inputFile.current.click()}
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
                      <GalleryItem
                        active={active}
                        sound_volume={sound_volume}
                        data={i}
                        key={i.id}
                        onSelect={setActive}
                        onDelete={onDelete}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className={styles["modal-block__footer"]}>
              <div className="flat-btn" style={{ display: "flex" }}>
                <button
                  className={`medium basic hide ${isLoading ? "disabled" : ""}`}
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
                  className={`primary medium basic hide ${isLoading ? "disabled" : ""}`}
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
        </modal-window>
      )}

      {isLinkVisible && (
        <modal-window data-show="show" className={styles["show"]}>
          <div className={styles["modal-block"] + " " + styles["modal-block_medium"]} style={{ width: "440px" }} ref={refLinkVisible}>
            <div className={styles["modal-block__title"]}>
              <span> {title_link} </span>
            </div>

            <div className={styles["modal-block__content"] + " files-gallery"} style={{ padding: "15px 24px", display: "flex" }}>
              {fileType === "images" && (
                <>
                  <img style={{ display: linkValueError ? "" : "none" }} src={image_svg} alt="preview" width={38} height={38} />
                  <img
                    style={{ display: linkValueError ? "none" : "" }}
                    src={linkValue}
                    alt="preview"
                    width={38}
                    height={38}
                    onLoad={() => setLinkValueError(false)}
                    onError={() => setLinkValueError(true)}
                  />
                </>
              )}
              {fileType === "sounds" && <img src={sound_svg} alt="preview" width={38} height={38} />}

              <div className="wasd-input-wrapper" style={{ marginLeft: "5px" }}>
                <div className={`wasd-input ${linkValueError ? "warning" : ""}`}>
                  <input
                    placeholder={"https://example.com/" + fileType}
                    onChange={(e) => {
                      setLinkValue(e.target.value);
                      if (fileType === "sounds") setLinkValueError(!e.target.value.trim().slice(0, 8).includes("https://"));
                    }}
                    value={linkValue}
                    style={{ margin: "0px" }}
                  />
                </div>
              </div>
            </div>

            <div className={styles["modal-block__footer"]}>
              <div className="flat-btn" style={{ display: "flex" }}>
                <button
                  className={`medium basic hide ${isLoading ? "disabled" : ""}`}
                  style={{ marginRight: "5px" }}
                  onClick={() => {
                    setIsLinkVisible(false);
                    setLinkValue("");
                  }}
                >
                  отмена
                </button>
                <button
                  style={{ width: "141.2px" }}
                  className={`primary medium basic hide ${isLoading ? "disabled" : ""}`}
                  disabled={linkValueError}
                  onClick={() => {
                    setIsLinkVisible(false);
                    onChange(linkValue);
                    setDefaultValue({ name: linkValue, thumbnailLink: linkValue, rawLink: linkValue });
                    setLinkValue("");
                  }}
                >
                  выбрать
                </button>
              </div>
            </div>
          </div>
        </modal-window>
      )}
    </>
  );
};

export default FilesGallery;
