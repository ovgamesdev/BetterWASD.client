import axios from "../axios";

const endpoint = {
  getPaint: () => axios.get("/v1/paint"),
  setPaint: (data: number) => axios.post("/v1/paint", data),
  deletePaint: () => axios.delete("/v1/paint"),

  getPaints: async () => {
    try {
      const { data } = await axios.get(`v1/users`);
      return Promise.resolve(data.paints);
    } catch (e) {
      return Promise.reject();
    }
  },
};

export default endpoint;
