import { useEffect } from 'react';


const useMeta = ({ title, description, image, imageType }, args = []) => {
  useEffect(() => {
    const prevTitle = document.title;

    if (document.title !== title) document.title = title

    let og_des = description && document.head.querySelector<HTMLMetaElement>("meta[name='og:description']")
    if (!og_des && description) {
      og_des = document.createElement("meta")
      document.head.appendChild(og_des);
    }
    if (description) {
      og_des.name = "og:description";
      og_des.content = description
    }
    let des = description && document.head.querySelector<HTMLMetaElement>("meta[name='description']")
    if (!des && description) {
      des = document.createElement("meta")
      document.head.appendChild(des);
    }
    if (description) {
      des.name = "description";
      des.content = description
    }
    let og_img = image && document.head.querySelector<HTMLMetaElement>("meta[name='og:image']")
    if (!og_img && image) {
      og_img = document.createElement("meta")
      document.head.appendChild(og_img);
    }
    if (image) {
      og_img.name = "og:image";
      og_img.content = image
    }
    let og_img_type = imageType && document.head.querySelector<HTMLMetaElement>("meta[name='og:image:type']")
    if (!og_img_type && imageType) {
      og_img_type = document.createElement("meta")
      document.head.appendChild(og_img_type);
    }
    if (imageType) {
      og_img_type.name = "og:image:type";
      og_img_type.content = imageType
    }


    return () => {
      if (document.title !== prevTitle) document.title = prevTitle

      if (og_des) og_des.remove()
      if (des) des.remove()
      if (og_img) og_img.remove()
      if (og_img_type) og_img_type.remove()
    }

  }, [description, image, imageType, title, args]);

};

export default useMeta;