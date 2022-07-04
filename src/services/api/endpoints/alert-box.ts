import axios from "../axios";

const endpoint = {
  testFollow: () => axios.post(`/v1/alert-box/test/follow/`),
  testSub: () => axios.post(`/v1/alert-box/test/sub/`),
  testRaid: () => axios.post(`/v1/alert-box/test/raid/`),

  uploadFile: (type: "sounds" | "images", data: any) => axios.post(`/v1/upload/alertbox/${type}/`, data),
  getFiles: (type: "sounds" | "images" ) => axios.get(`/v1/upload/alertbox/${type}/`),
  deleteFile: (type: "sounds" | "images", id: string) => axios.delete(`/v1/upload/alertbox/${type}/${id}`),
};

export default endpoint;
