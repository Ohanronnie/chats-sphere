import axios, { AxiosInstance } from "axios";

export default function instance(): AxiosInstance {
  let instance = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true,
    timeout: 1000 * 60 * 60,
  });
  instance.interceptors.request.use(
    async (config) => {
      let token;
      if (localStorage.getItem("token")) {
        token = localStorage.getItem("token");
        config.headers["Authorisation"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return instance;
}
