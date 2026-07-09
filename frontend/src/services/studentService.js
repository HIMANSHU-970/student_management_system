import axios from 'axios';

const API_URL = 'http://localhost:5002/api/student';

// टोकन गेट करने के लिए हेल्पर
const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return { headers: { Authorization: `Bearer ${user?.token}` } };
};

export const studentService = {
    getProfile: async () => {
        const res = await axios.get(`${API_URL}/profile`, getAuthHeaders());
        return res.data;
    },
    updateProfile: async (data) => {
        const res = await axios.put(`${API_URL}/profile`, data, getAuthHeaders());
        return res.data;
    },
    getAttendance: async () => {
        const res = await axios.get(`${API_URL}/attendance`, getAuthHeaders());
        return res.data;
    },
    // 🆕 NAYA: present/total wala attendance overview (Attendance.jsx ye use karega)
    getAttendanceOverview: async () => {
        const res = await axios.get(`${API_URL}/attendance-overview`, getAuthHeaders());
        return res.data;
    },
    getCourses: async () => {
        const res = await axios.get(`${API_URL}/courses`, getAuthHeaders());
        return res.data;
    },
    getFees: async () => {
        const res = await axios.get(`${API_URL}/fees`, getAuthHeaders());
        return res.data;
    },
    // 🔥 notice
    getNotices: async () => {
        const res = await axios.get(`${API_URL}/notices`, getAuthHeaders());
        return res.data;
    },
    // 🔥 timetable
    getTimetable: async () => {
    const res = await axios.get(`${API_URL}/timetable`, getAuthHeaders());
    return res.data;
},
// 🔥 study materials
getMaterials: async () => {
    const res = await axios.get(`${API_URL}/materials`, getAuthHeaders());
    return res.data;
},
// 🔥 exams
getExams: async () => {
    const res = await axios.get(`${API_URL}/exams`, getAuthHeaders());
    return res.data;
},
getResults: async () => {
    const res = await axios.get(`${API_URL}/results`, getAuthHeaders());
    return res.data;
},
// 🆕 LEAVE MANAGEMENT
applyLeave: async (data) => {
    const res = await axios.post(`${API_URL}/leave`, data, getAuthHeaders());
    return res.data;
},
getMyLeaves: async () => {
    const res = await axios.get(`${API_URL}/leave`, getAuthHeaders());
    return res.data;
},
};