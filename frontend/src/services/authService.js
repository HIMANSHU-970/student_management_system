import axios from "axios";

const API = "http://localhost:5002/api/auth";

const apiClient = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" }
});

// Request interceptor: Har request mein token auto-attach karega
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signupUser = (data) => apiClient.post("/signup", data);
export const loginUser = (data) => apiClient.post("/login", data);