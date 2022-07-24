import axios from "../axios";

const endpoint = {
  post: (type: "sounds" | "images", data: any, user_id: number) => axios.post(`/v1/upload/${type}/${typeof user_id !== "undefined" ? user_id : ""}`, data),
  get: (type: "sounds" | "images", user_id: number) => axios.get(`/v1/upload/${type}/${typeof user_id !== "undefined" ? user_id : ""}`),
  delete: (type: "sounds" | "images", id: string, user_id: number) => axios.delete(`/v1/upload/${type}/${id}/${typeof user_id !== "undefined" ? user_id : ""}`),
};

export default endpoint;
