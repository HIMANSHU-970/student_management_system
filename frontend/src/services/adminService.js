import axios from "axios";

const API = "http://localhost:5002/api/admin";

const apiClient = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getAllTeachers = () => apiClient.get("/teachers");
export const getAllSubjects = () => apiClient.get("/subjects");
export const createSubject = (data) => apiClient.post("/subjects", data);
export const assignSubjectToTeacher = (data) => apiClient.post("/assign-subject", data);
export const removeSubjectFromTeacher = (id) => apiClient.delete(`/assign-subject/${id}`);
export const getAllAssignments = () => apiClient.get("/assignments");