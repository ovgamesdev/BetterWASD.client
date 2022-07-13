import axios from "../axios";

const endpoint = {
  get: () => axios.get("/v1/bells/"),
  getAll: () => axios.get("/v1/bells/all"),
  delete: (id: string) => axios.delete(`/v1/bells/${id}`),
  create: (data: any) => axios.post(`/v1/bells/`, data),
  update: (id: string, data: any) => axios.put(`/v1/bells/${id}`, data),
};

export default endpoint;
