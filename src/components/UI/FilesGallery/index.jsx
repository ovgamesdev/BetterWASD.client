import React, { useRef, useState, useEffect } from "react";
import api from "../../../services/api/index.js";
import { toast } from "react-toastify";

import useAuth from "../../../hooks/useAuth/index.jsx";
import useComponentVisible from "../../../hooks/useComponentVisible/index.tsx";

import GalleryItem from "./Item";
import Loading from "../Loading/Button";
import TabGroup from "../TabGroupV2";
import AssetDragdrop from "./AssetDragdrop";
import Input from "../Input/index.jsx";
import Modal from "../Modal";

import "./dropdrag-zone.scss";
import "./files-gallery.scss";
import play_svg from "./svg/play.svg";
import pause_svg from "./svg/pause.svg";
import link_svg from "./svg/link.svg";
import close_svg from "./svg/close.svg";
import file_upload_svg from "./svg/file_upload.svg";
import image_svg from "./svg/image.svg";
import sound_svg from "./svg/music_note.svg";

const FilesGallery = ({ value, onChange, fileType, title, title_link, fileAccept, sound_volume, isInputOnly = false, style }) => {
  const auth = useAuth();

  const [defaultValue, setDefaultValue] = useState(value);
  const [active, setActive] = useState(defaultValue);
  const [activeTab, setActiveTab] = useState("general");
  const [linkValue, setLinkValue] = useState("");
  const [linkValueError, setLinkValueError] = useState(true);

  const [drag, setDrag] = useState(false);
  const [isPlayed, setIsPlayed] = useState(null);
  const [itemPlayed, setItemPlayed] = useState(null);

  const inputFile = useRef(null);
  const toastId = useRef(null);

  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false, (is) => {
    if (is) return;
    itemPlayed && itemPlayed.audio.pause();
    setItemPlayed(null);
    setActive(defaultValue);
  });
  const { ref: refLinkVisible, isComponentVisible: isLinkVisible, setIsComponentVisible: setIsLinkVisible } = useComponentVisible();

  useEffect(() => {
    return () => {
      isPlayed && isPlayed.pause();
      itemPlayed && itemPlayed.audio.pause();
    };
  }, [isPlayed, itemPlayed]);

  const onPlay = (item) => {
    if (itemPlayed?.rawLink === item.rawLink) {
      itemPlayed.audio.pause();
      setItemPlayed(null);
      return;
    }

    const audio = new Audio(item.rawLink);
    setItemPlayed({ ...item, audio });
    audio.volume = sound_volume / 100;
    audio.play();
    audio.onended = () => setItemPlayed(null);
    audio.onerror = () => {
      setItemPlayed(null);
      toast.error("Мы не можем воспроизвести этот звук");
    };
  };

  const onDelete = async (item) => {
    try {
      const isDelete = global.confirm("Вы уверены?");
      if (!isDelete) return;

      if (itemPlayed?.id === item.id) {
        itemPlayed.audio.pause();
        setItemPlayed(null);
      }

      if (active?.rawLink === item.rawLink) setActive(defaultValue);

      if (defaultValue?.rawLink === item.rawLink) {
        const def = auth.files[fileType].channel[0]?.rawLink !== item.rawLink ? auth.files[fileType].channel[0] : auth.files[fileType].channel[1];

        setActive(def);
        setDefaultValue(def);

        onChange({ raw: def.rawLink, metadata: { name: def.name, thumbnailLink: def.thumbnailLink, rawLink: def.rawLink, mimeType: def.mimeType } });
      }

      await api.upload.delete(fileType, item.id, auth.editor?.user_id);

      auth.setFiles({ ...auth.files, [fileType]: { channel: auth.files[fileType].channel.filter((g) => g.id !== item.id), global: auth.files[fileType].global } });

      toast.success("Файл удален");
    } catch (e) {
      if (e.response.data.code === "NOT_ACCESS") {
        toast.error("Нет доступа");
      } else {
        toast.error("Ошибка удаления");
      }
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

      const { data } = await api.upload.post(fileType, formData, auth.editor?.user_id);
      if (data.error) {
        return toast.update(toastId.current, {
          render: "Ошибка загрузки файла.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
      auth.setFiles({ ...auth.files, [fileType]: { channel: [...auth.files[fileType].channel, data], global: auth.files[fileType].global } });

      toast.update(toastId.current, { render: "Файл загружен!", type: "success", isLoading: false, autoClose: 5000 });
    } catch (e) {
      if (e.response.data.code === "LIMIT_FILE_SIZE") {
        toast.update(toastId.current, { render: "Размер файла превысил 2,5 Мб.", type: "error", isLoading: false, autoClose: 5000 });
      } else if (e.response.data.code === "NOT_ACCESS") {
        toast.update(toastId.current, { render: "Нет доступа", type: "error", isLoading: false, autoClose: 5000 });
      } else {
        toast.update(toastId.current, { render: "Мы не можем загрузить этот файл.", type: "error", isLoading: false, autoClose: 5000 });
      }
    }

    toastId.current = null;
  };

  const accessUploadFile = auth.editor?.access ? (auth.editor?.access?.canUploadFile ? true : false) : true;

  return (
    <>
      <div className="preview" style={style}>
        {!isInputOnly && fileType === "images" && <div className="img" style={{ backgroundImage: `url(${value.thumbnailLink || image_svg})` }} />}
        {!isInputOnly && fileType === "sounds" && (
          <div className="flat-btn">
            <button
              className="medium primary"
              onClick={() => {
                if (isPlayed) {
                  isPlayed.pause();
                  return setIsPlayed(null);
                }
                const audio = new Audio(defaultValue.rawLink);
                audio.volume = sound_volume / 100;
                setIsPlayed(audio);
                audio.play();
                audio.onended = () => setIsPlayed(null);
                audio.onerror = () => {
                  setIsPlayed(null);
                  toast.error("Мы не можем воспроизвести этот звук");
                };
              }}
            >
              <img referrerPolicy="no-referrer" width={30} height={30} src={isPlayed ? pause_svg : play_svg} alt={isPlayed ? "pause" : "play"} />
            </button>
          </div>
        )}

        <Input
          placeholder={`https://example.com/${fileType}`}
          readOnly
          value={value.name}
          inputClassName={isComponentVisible || isLinkVisible ? "active" : ""}
          style={{ marginLeft: "5px" }}
          inputStyle={{ margin: 0, paddingRight: "100px" }}
        >
          <div className="picker__controls">
            <img width={20} className="picker-item" src={link_svg} alt="link" title={"Link " + fileType} onClick={() => setIsLinkVisible(true)} />
            {value.rawLink !== "" && (
              <img
                width={20}
                className="picker-item"
                src={close_svg}
                alt="close"
                title={"Remove " + fileType}
                onClick={() => {
                  onChange({ raw: "", metadata: { name: "", thumbnailLink: "", rawLink: "", mimeType: "" } });
                  setDefaultValue({ name: "", thumbnailLink: "", rawLink: "", mimeType: "" });
                }}
              />
            )}
            <img width={20} className="picker-item" src={file_upload_svg} alt="file_upload" title={"Select " + fileType} onClick={() => setIsComponentVisible(true)} />
          </div>
        </Input>
      </div>

      <Modal isShow={isComponentVisible} visibleRef={ref} contentClassName="files-gallery" contentStyle={{ minHeight: "400px", maxHeight: "400px", display: "flex", flexDirection: "column" }}>
        <span> {title} </span>
        <>
          <TabGroup
            style={{ width: "190px", paddingTop: "10px" }}
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
                {auth.files[fileType].isLoading && <Loading />}
                {auth.files[fileType].global?.map((i) => (
                  <GalleryItem
                    active={active}
                    sound_volume={sound_volume}
                    data={i}
                    key={i.id}
                    onSelect={setActive}
                    onDelete={onDelete}
                    onPlay={onPlay}
                    itemPlayed={itemPlayed}
                    access={accessUploadFile}
                  />
                ))}
              </div>
            </>
          )}
          {activeTab === "upload" && (
            <>
              <input type="file" accept={fileAccept} ref={inputFile} style={{ display: "none" }} onChange={onUpload} />
              <div className="scrolled" style={{ height: "355px" }}>
                <AssetDragdrop dragStartHandler={dragStartHandler} dragLeaveHandler={dragLeaveHandler} onDropHandler={onDropHandler} drag={drag} inputFile={inputFile} access={accessUploadFile} />
                <div className="emotes">
                  {auth.files[fileType].isLoading && <Loading />}
                  {auth.files[fileType].channel?.map((i) => (
                    <GalleryItem
                      active={active}
                      sound_volume={sound_volume}
                      data={i}
                      key={i.id}
                      onSelect={setActive}
                      onDelete={onDelete}
                      onPlay={onPlay}
                      itemPlayed={itemPlayed}
                      access={accessUploadFile}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </>
        <div className="flat-btn" style={{ display: "flex" }}>
          <button
            className="medium basic hide"
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
            className="primary medium basic hide"
            onClick={() => {
              onChange({ raw: active.rawLink, metadata: { name: active.name, thumbnailLink: active.thumbnailLink, rawLink: active.rawLink, mimeType: active.mimeType } });
              setDefaultValue(active);
              setIsComponentVisible(false);
            }}
          >
            выбрать
          </button>
        </div>
      </Modal>

      <Modal isShow={isLinkVisible} visibleRef={refLinkVisible} contentClassName="files-gallery" contentStyle={{ padding: "15px 24px", display: "flex" }}>
        <span> {title_link} </span>
        <>
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

          <Input
            placeholder={`https://example.com/${fileType}`}
            onChange={(e) => {
              setLinkValue(e.target.value.trim());
              if (fileType === "sounds") setLinkValueError(!e.target.value.trim().slice(0, 8).includes("https://"));
            }}
            value={linkValue}
            className={linkValueError ? "warning" : ""}
            style={{ marginLeft: "5px" }}
          />
        </>
        <div className="flat-btn" style={{ display: "flex" }}>
          <button
            className="medium basic hide"
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
            className="primary medium basic hide"
            disabled={linkValueError}
            onClick={() => {
              setIsLinkVisible(false);
              onChange({ raw: linkValue, metadata: { name: linkValue.split("/")[linkValue.split("/").length - 1], thumbnailLink: linkValue, rawLink: linkValue, mimeType: "image/gif" } });
              setDefaultValue({ name: linkValue.split("/")[linkValue.split("/").length - 1], thumbnailLink: linkValue, rawLink: linkValue, mimeType: "image/gif" });
              setLinkValue("");
            }}
          >
            выбрать
          </button>
        </div>
      </Modal>
    </>
  );
};

export default FilesGallery;
