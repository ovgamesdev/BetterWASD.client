import axios from "../axios";

const endpoint = {
  testFollow: (user_id: number) => axios.post(`//betterwasd.herokuapp.com/api/v1/alert-box/test/follow/${typeof user_id !== "undefined" ? user_id : ""}`),
  testSub: (user_id: number) => axios.post(`//betterwasd.herokuapp.com/api/v1/alert-box/test/sub/${typeof user_id !== "undefined" ? user_id : ""}`),
  testPaidMessage: (user_id: number) => axios.post(`//betterwasd.herokuapp.com/api/v1/alert-box/test/paid-message/${typeof user_id !== "undefined" ? user_id : ""}`),
  testRaid: (user_id: number) => axios.post(`//betterwasd.herokuapp.com/api/v1/alert-box/test/raid/${typeof user_id !== "undefined" ? user_id : ""}`),
  testBan: (user_id: number) => axios.post(`//betterwasd.herokuapp.com/api/v1/alert-box/test/ban/${typeof user_id !== "undefined" ? user_id : ""}`),
};

export default endpoint;
