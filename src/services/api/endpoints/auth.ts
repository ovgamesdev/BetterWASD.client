import axios from "../axios";

const endpoint = {
  getProfile: (data: object) => axios.get("/v1/profile/current", data),
  checkToken: (data: object) => axios.post("/v1/check-token", data),

  getEditors: () => axios.get("/v1/profile/current/editors"),
  addEditor: (data: object) => axios.post("/v1/profile/current/editors", data),
  deleteEditor: (user_id: number) => axios.delete("/v1/profile/current/editors/" + user_id),
  updateEditorAccess: (editor_id: number, data: object) => axios.put(`/v1/profile/current/editors/${editor_id}/access`, data),

  getSubscribeUrl: () => axios.post("/v1/subscription/subscribe"),
  getGiftSubscribeUrl: (data: object) => axios.post("/v1/subscription/gift", data),
  getSubscribe: () => axios.get("/v1/subscription"),

  getAlertSettings: (user_id: number) => axios.get(`/v1/profile/alert/${typeof user_id !== "undefined" ? user_id : ""}`),
  getAlertSettingsByToken: (token: string) => axios.get("/v1/profile/current/alert/" + token),
  editAlertSettings: (data: any, user_id: number) => axios.put(`/v1/profile/alert/${typeof user_id !== "undefined" ? user_id : ""}`, data),
};

export default endpoint;
// getAlertSettings editAlertSettings
