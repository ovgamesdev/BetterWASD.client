import axios from "../axios";

const endpoint = {
  getSubBadges: (user_id: number) =>
    axios.get(`/v1/sub-badge/${typeof user_id !== "undefined" ? user_id : ""}`),
  setSubBadges: (data: object, user_id: number) =>
    axios.post(
      `/v1/sub-badge/${typeof user_id !== "undefined" ? user_id : ""}`,
      data
    ),
  deleteSubBadges: (user_id: number) =>
    axios.delete(
      `/v1/sub-badge/${typeof user_id !== "undefined" ? user_id : ""}`
    ),
};

export default endpoint;
