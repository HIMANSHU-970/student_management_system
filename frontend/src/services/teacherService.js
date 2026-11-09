import axios from "axios";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5002"}/api/teacher`;

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

// 🆕 Attendance (sirf apne assigned subjects ki)
export const getMyCourseAttendance = () => apiClient.get("/my-attendance");
export const updateMyCourseAttendance = (id, data) => apiClient.put(`/attendance/${id}`, data);
export const getStudentAttendanceForMyCourses = (studentId) => apiClient.get(`/student-attendance/${studentId}`);
export const getTeacherNotices = () => apiClient.get("/notices");
export const getMyTimetable = () => apiClient.get("/timetable");

// 🆕 Study Materials (sirf apne assigned subjects ki)
export const uploadMaterial = (formData) => apiClient.post("/materials", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const getMyMaterials = () => apiClient.get("/materials");
export const deleteMaterial = (id) => apiClient.delete(`/materials/${id}`);

// 🆕 Exams (sirf apne assigned subjects ki)
export const getMyExams = () => apiClient.get("/exams");
export const enterMyExamResult = (data) => apiClient.post("/exam-results", data);

// Students
export const getStudents = () => apiClient.get("/students");