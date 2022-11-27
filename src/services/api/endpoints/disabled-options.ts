import axios from "../axios";

const endpoint = {
  get: () => axios.get(`/v1/disabled-options`),
  update: (data: Array<string>) => axios.put(`/v1/disabled-options`, data),
};

export default endpoint;
