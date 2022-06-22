import axios from "../axios";

const endpoint = {
  submit: (data: any) => axios.post(`/v1/stat/tv/form/`, data),
  init: (user_id: any) => axios.post(`/v1/stat/tv/uninstall/${user_id}`),
};



export default endpoint;
