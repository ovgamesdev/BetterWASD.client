import axios from "../axios";

const endpoint = {
  getPaint: () => axios.get("/v1/paint"),
  setPaint: (data: number) => axios.post("/v1/paint", data),
  deletePaint: () => axios.delete("/v1/paint"),
};

export default endpoint;
