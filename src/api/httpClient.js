import axios from "axios";
import { API_URL } from "@/config/env";
import { createSearchParams } from "react-router-dom";

const axiosInstance = axios.create();

export default axiosInstance;

export const httpClient = async (
  method,
  url,
  data,
  options,
  isFullURL = false,
  searchParams =null
) => {
   let fullURL = isFullURL ? url : `${API_URL}${url}`;

  if (searchParams && typeof searchParams === "object") {
    const searchParamsString = createSearchParams(searchParams).toString();
    fullURL += `?${searchParamsString}`;
  }
  return await axiosInstance({
    method: method || "POST",
    url: fullURL,
    data,
    headers: {
      "Content-Type":
        options === "formData" ? "multipart/form-data" : "application/json",
    },
  });
};

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return {
      status: response.status,
      data: response.data,
    };
  },
  (error) => {
    const status = error?.response?.status;
    if (
      (error.code === "ERR_NETWORK" || error.response.status >= 500) &&
      location.pathname !== "/500"
    ) {
      // window.location.href = "/500";
      return Promise.reject(error);
    }
    if (error.response.status === 401) {
      localStorage.clear();
      window.location.reload();
      return Promise.reject(error);
    }
    // return {
    //   status: error.response.status,
    //   data: error.response.data,
    // };
    //  return Promise.reject(error);
    //   const customError = {
    //   ...error,
    //   response: {
    //     ...error.response,
    //     data: {
    //       status,
    //       ...error.response?.data,
    //     },
    //   },
    // };

    return Promise.reject(error);
  }
);
