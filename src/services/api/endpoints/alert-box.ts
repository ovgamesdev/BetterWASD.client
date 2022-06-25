import axios from "../axios";

const endpoint = {
  testFollow: () => axios.post(`/v1/alert-box/test/follow/`),
  testSub: () => axios.post(`/v1/alert-box/test/sub/`),
  testRaid: () => axios.post(`/v1/alert-box/test/raid/`),
};

export default endpoint;
