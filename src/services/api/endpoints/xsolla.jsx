import axios from "../axios";

const endpoint = {
  getToken: () => axios.get("/v1/xsolla/token"),
};

export default endpoint;
