import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";

export const registerUser = async (formData) => {
  const res = await axios.post(`${API_URL}/register`, formData);
  return res.data;
};

export const loginUser = async (formData) => {
  const res = await axios.post(`${API_URL}/login`, formData);
  return res.data;
};
