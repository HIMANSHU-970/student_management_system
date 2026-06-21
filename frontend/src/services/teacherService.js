import axios from "axios";

const API = "http://localhost:5002/api/teacher";

const apiClient = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getMySubjects = () => apiClient.get("/my-subjects");