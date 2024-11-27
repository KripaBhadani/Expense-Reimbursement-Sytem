// src/components/Dashboards/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
