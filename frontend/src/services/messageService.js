import axios from "axios";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5002"}/api/messages`;

const apiClient = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const sendMessage = (data) => apiClient.post("/send", data);
export const getConversation = (otherUserId) => apiClient.get(`/conversation/${otherUserId}`);
export const getContacts = () => apiClient.get("/contacts");
export const getUnreadCount = () => apiClient.get("/unread-count");