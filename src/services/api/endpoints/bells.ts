import axios from "../axios";

const endpoint = {
  get: () => axios.get("/v1/bells"),
};

export default endpoint;
