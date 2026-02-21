import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const uploadDocument = async (file) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    `${API_URL}/api/docs/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const getMyDocuments = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API_URL}/api/docs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getPreviewUrl = async (docId) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${API_URL}/api/docs/${docId}/preview`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.url;
};

export const deleteDocument = async (id) => {
  const token = localStorage.getItem("token");

  const res = await axios.delete(
    `${API_URL}/api/docs/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};