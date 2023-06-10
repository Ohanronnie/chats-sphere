import axios, { AxiosInstance } from "axios";

export default function instance(): AxiosInstance {
  let instance = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true,
    timeout: 1000 * 60 * 60,
  });
  /*  instance.interceptors.request.use(
    async (config) => {
      let csrf;
      if (sessionStorage.getItem("token")) {
        csrf = sessionStorage.getItem("token");
      } else {
        let csrfToken = await axios.get("http://localhost:3001/csrf");
        sessionStorage.setItem("token", csrfToken.data);
        csrf = csrfToken.data;
      }
      config.headers["X-CSRF-Token"] = csrf;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );*/
  return instance;
}
