import axios from "../axios";

const endpoint = {
  getProfile: (data) => axios.get("/v1/profile/current", data),
  checkToken: (data) => axios.post("/v1/check-token", data),
  getEditors: () => axios.get("/v1/profile/current/editors"),
  addEditor: (data) => axios.post("/v1/profile/current/editors", data),
  deleteEditor: (user_id) =>
    axios.delete("/v1/profile/current/editors/" + user_id),
};

export default endpoint;
