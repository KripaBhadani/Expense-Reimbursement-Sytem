import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Dynamically attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("Token not found in localStorage");
    }
    console.log("Request URL:", config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
