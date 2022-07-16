import axios from "../axios";

const endpoint = {
  getProfile: (data: object) => axios.get("/v1/profile/current", data),
  checkToken: (data: object) => axios.post("/v1/check-token", data),
  getEditors: () => axios.get("/v1/profile/current/editors"),
  addEditor: (data: object) => axios.post("/v1/profile/current/editors", data),
  deleteEditor: (user_id: number) => axios.delete("/v1/profile/current/editors/" + user_id),
  getSubscribeUrl: () => axios.post("/v1/subscription/subscribe"),
  getGiftSubscribeUrl: (data: object) => axios.post("/v1/subscription/gift", data),
  getSubscribe: () => axios.get("/v1/subscription"),

  getAlertSettings: () => axios.get("/v1/profile/current/alert"),
  getAlertSettingsByToken: (token: string) => axios.get("/v1/profile/current/alert/" + token),
  editAlertSettings: (data: any) => axios.put("/v1/profile/current/alert", data),
};

export default endpoint;
