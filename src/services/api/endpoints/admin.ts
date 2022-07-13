import axios from "../axios";

const endpoint = {
  getPaints: (limit: number, offset: number) => axios.get(`/v1/paint/all?limit=${limit}&offset=${offset}`),
  deletePaint: (id: string) => axios.delete(`/v1/paint/${id}`),
};

export default endpoint;
