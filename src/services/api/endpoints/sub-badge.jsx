import axios from "../axios";

const endpoint = {
  getSubBadges: (user_id) =>
    axios.get(`/v1/sub-badge/${typeof user_id !== "undefined" ? user_id : ""}`),
  setSubBadges: (data, user_id) =>
    axios.post(
      `/v1/sub-badge/${typeof user_id !== "undefined" ? user_id : ""}`,
      data
    ),
  deleteSubBadges: (user_id) =>
    axios.delete(
      `/v1/sub-badge/${typeof user_id !== "undefined" ? user_id : ""}`
    ),
};

export default endpoint;
