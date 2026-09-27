// Next
import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

api.interceptors.request.use((request) => {
  request.headers.Authorization = `Bearer ${Cookies.get("accessToken")}`;
  return request;
});

// An expired token is dropped here, so the next session check sends the user to the login screen.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status == 401) Cookies.remove("accessToken");

    return Promise.reject(error);
  }
);
