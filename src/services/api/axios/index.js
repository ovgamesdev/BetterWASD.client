import axios from "axios";

export const HOSTURL = localStorage.debug ? "http://localhost:5000" : "https://betterwasd.herokuapp.com";

const axiosInstance = axios.create({ baseURL: HOSTURL + "/api" });

axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = localStorage["auth-token"];

    if (authToken) config.headers.authorization = `Token ${authToken}`;

    return config;
  },
  (error) => Promise.request(error)
);

export default axiosInstance;
