import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-expense-tracker-ba8v.onrender.com/api/", // Render backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
