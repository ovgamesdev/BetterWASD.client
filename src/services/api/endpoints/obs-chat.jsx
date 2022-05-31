import axios from "../axios";

const endpoint = {
  getSettings: (user_id) =>
    axios.get(`/v1/obs-chat/${typeof user_id !== "undefined" ? user_id : ""}`),
  setSettings: (data, user_id) =>
    axios.post(
      `/v1/obs-chat/${typeof user_id !== "undefined" ? user_id : ""}`,
      data
    ),
};

export default endpoint;
