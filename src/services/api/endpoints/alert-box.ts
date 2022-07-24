import axios from "../axios";

const endpoint = {
  testFollow: (user_id: number) => axios.post(`/v1/alert-box/test/follow/${typeof user_id !== "undefined" ? user_id : ""}`),
  testSub: (user_id: number) => axios.post(`/v1/alert-box/test/sub/${typeof user_id !== "undefined" ? user_id : ""}`),
  testRaid: (user_id: number) => axios.post(`/v1/alert-box/test/raid/${typeof user_id !== "undefined" ? user_id : ""}`),
};

export default endpoint;
