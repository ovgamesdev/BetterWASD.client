import axios from "../axios";

const endpoint = {
  get: () => axios.get("/v1/support/"),
  getAll: () => axios.get("/v1/support/all"),
  delete: (id: string) => axios.delete(`/v1/support/${id}`),
  create: (message: string, email: string) => axios.post("/v1/support", { message, email }),
  reply: (id: string, message: string, email: string) => axios.post(`/v1/support/reply/${id}`, { message, email }),
  update: (id: string, data: any) => axios.put(`/v1/support/${id}`, data),
};

export default endpoint;
