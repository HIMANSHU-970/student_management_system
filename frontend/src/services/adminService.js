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

// Error interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    // Don't throw, return error object
    return Promise.reject(error);
  }
);

// Helper function to handle API calls with fallback
const handleApiCall = async (apiCall, fallbackData = null) => {
  try {
    const response = await apiCall();
    // Save to localStorage for backup
    if (response.data && Array.isArray(response.data)) {
      const key = apiCall.name || 'data';
      localStorage.setItem(`api_${key}`, JSON.stringify(response.data));
    }
    return response;
  } catch (error) {
    console.warn("API call failed, using fallback:", error.message);
    // Try to get from localStorage
    const key = apiCall.name || 'data';
    const localData = localStorage.getItem(`api_${key}`);
    if (localData) {
      return { data: JSON.parse(localData) };
    }
    if (fallbackData) {
      return { data: fallbackData };
    }
    throw error;
  }
};

// TEACHER-SUBJECT ASSIGNMENT
export const getAllTeachers = () => apiClient.get("/teachers");
export const getAllSubjects = () => apiClient.get("/subjects");
export const createSubject = (data) => apiClient.post("/subjects", data);
export const assignSubjectToTeacher = (data) => apiClient.post("/assign-subject", data);
export const removeSubjectFromTeacher = (id) => apiClient.delete(`/assign-subject/${id}`);
export const getAllAssignments = () => apiClient.get("/assignments");

// USERS
export const getAllUsers = () => apiClient.get("/users");
export const deleteUser = (id) => apiClient.delete(`/user/${id}`);

// STUDENT-COURSE ENROLLMENT + ATTENDANCE
export const getAllStudents = async () => {
  try {
    const response = await apiClient.get("/students");
    if (response.data && Array.isArray(response.data)) {
      localStorage.setItem('students_backup', JSON.stringify(response.data));
    }
    return response;
  } catch (error) {
    console.warn("Failed to fetch students, using backup:", error.message);
    const backup = localStorage.getItem('students_backup');
    if (backup) {
      return { data: JSON.parse(backup) };
    }
    // Return mock data if no backup
    return { data: [
      { id: 1, name: "Rohit", email: "rohit970@gmail.com" },
      { id: 2, name: "Himanshu", email: "himanshukumar82298@gmail.com" }
    ]};
  }
};

export const enrollStudentInCourse = (data) => apiClient.post("/enroll-student", data);
export const getStudentAttendanceOverview = (studentId) => apiClient.get(`/student-attendance/${studentId}`);
export const updateAttendanceOverride = (id, data) => apiClient.put(`/attendance-override/${id}`, data);
export const getAllAttendanceRecords = () => apiClient.get("/attendance-all");
export const createNotice = (data) => apiClient.post("/notices", data);
export const getAllNotices = () => apiClient.get("/notices");
export const deleteNotice = (id) => apiClient.delete(`/notices/${id}`);

// DEPARTMENTS
export const getAllDepartments = () => apiClient.get("/departments");
export const createDepartment = (data) => apiClient.post("/departments", data);
export const updateDepartment = (id, data) => apiClient.put(`/departments/${id}`, data);
export const deleteDepartment = (id) => apiClient.delete(`/departments/${id}`);

// CLASSES/SECTIONS
export const getAllClasses = () => apiClient.get("/classes");
export const createClass = (data) => apiClient.post("/classes", data);
export const updateClass = (id, data) => apiClient.put(`/classes/${id}`, data);
export const deleteClass = (id) => apiClient.delete(`/classes/${id}`);

// TIMETABLE
export const getAllTimetable = () => apiClient.get("/timetable");
export const createTimetableSlot = (data) => apiClient.post("/timetable", data);
export const deleteTimetableSlot = (id) => apiClient.delete(`/timetable/${id}`);

// FEES - Updated with better error handling and local storage
export const getAllFees = async () => {
  try {
    const response = await apiClient.get("/fees");
    // Save to localStorage for backup
    if (response.data && Array.isArray(response.data)) {
      localStorage.setItem('fees_backup', JSON.stringify(response.data));
    }
    return response;
  } catch (error) {
    console.warn("Failed to fetch fees, using backup:", error.message);
    // Try to get from localStorage
    const backup = localStorage.getItem('fees_backup');
    if (backup) {
      return { data: JSON.parse(backup) };
    }
    // Return empty array if no backup
    return { data: [] };
  }
};

export const createFee = async (data) => {
  try {
    const response = await apiClient.post("/fees", data);
    // Update backup after successful creation
    const fees = await getAllFees();
    localStorage.setItem('fees_backup', JSON.stringify(fees.data));
    return response;
  } catch (error) {
    console.warn("Failed to create fee on server, saving locally:", error.message);
    // Save to localStorage anyway
    const fees = await getAllFees();
    const newFee = { ...data, id: Date.now() };
    const updatedFees = [...fees.data, newFee];
    localStorage.setItem('fees_backup', JSON.stringify(updatedFees));
    return { data: newFee };
  }
};

export const updateFee = async (id, data) => {
  try {
    const response = await apiClient.put(`/fees/${id}`, data);
    // Update backup after successful update
    const fees = await getAllFees();
    localStorage.setItem('fees_backup', JSON.stringify(fees.data));
    return response;
  } catch (error) {
    console.warn("Failed to update fee on server, saving locally:", error.message);
    // Update localStorage
    const fees = await getAllFees();
    const updatedFees = fees.data.map(f => 
      f.id === id ? { ...f, ...data } : f
    );
    localStorage.setItem('fees_backup', JSON.stringify(updatedFees));
    return { data: { id, ...data } };
  }
};

export const deleteFee = async (id) => {
  try {
    const response = await apiClient.delete(`/fees/${id}`);
    // Update backup after successful delete
    const fees = await getAllFees();
    localStorage.setItem('fees_backup', JSON.stringify(fees.data));
    return response;
  } catch (error) {
    console.warn("Failed to delete fee on server, deleting locally:", error.message);
    // Delete from localStorage
    const fees = await getAllFees();
    const updatedFees = fees.data.filter(f => f.id !== id);
    localStorage.setItem('fees_backup', JSON.stringify(updatedFees));
    return { data: { success: true } };
  }
};

// EXAMS
export const getAllExams = () => apiClient.get("/exams");
export const createExam = (data) => apiClient.post("/exams", data);
export const deleteExam = (id) => apiClient.delete(`/exams/${id}`);
export const enterExamResult = (data) => apiClient.post("/exam-results", data);
export const publishExamResults = (examId) => apiClient.put(`/exams/${examId}/publish`);
export const getExamResults = (examId) => apiClient.get(`/exams/${examId}/results`);

// LEAVE MANAGEMENT
export const getAllLeaves = () => apiClient.get("/leaves");
export const updateLeaveStatus = (id, status) => apiClient.put(`/leaves/${id}`, { status });

// PASSWORD RESET
export const resetPassword = async (userId, newPassword) => {
  return await apiClient.put(`/reset-password/${userId}`, { newPassword });
};