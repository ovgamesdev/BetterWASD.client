import axios from "../axios";

const endpoint = {
  getSettings: (user_id: number) =>
    axios.get(`/v1/obs-chat/${typeof user_id !== "undefined" ? user_id : ""}`),
  setSettings: (data: object, user_id: number) =>
    axios.post(
      `/v1/obs-chat/${typeof user_id !== "undefined" ? user_id : ""}`,
      data
    ),
};

export default endpoint;
