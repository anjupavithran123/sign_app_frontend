import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // your API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
instance.interceptors.request.use((config) => {
  // Use 'token' from localStorage
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
