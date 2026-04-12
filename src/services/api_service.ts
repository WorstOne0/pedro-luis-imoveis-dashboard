import axios from "axios";
import Cookies from "js-cookie";

const apiService = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiService.interceptors.request.use(
  (request) => {
    request.headers.Authorization = `Bearer ${Cookies.get("accessToken")}`;
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // typeof window === 'undefined'
    if (error.response?.status == 401) {
      Cookies.remove("accessToken");
    }

    return Promise.reject(error);
  }
);

export default apiService;
