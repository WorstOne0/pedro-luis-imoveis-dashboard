import axios from "axios";
import Cookies from "js-cookie";

// Set NEXT_PUBLIC_API_URL per environment; the localhost fallback only covers
// local development.
const apiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
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
