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
    getCourses: async () => {
        const res = await axios.get(`${API_URL}/courses`, getAuthHeaders());
        return res.data;
    },
    getFees: async () => {
        const res = await axios.get(`${API_URL}/fees`, getAuthHeaders());
        return res.data;
    },
    // 🔥 यहाँ हमने नया नोटिस फंक्शन जोड़ दिया है
    getNotices: async () => {
        const res = await axios.get(`${API_URL}/notices`, getAuthHeaders());
        return res.data;
    }
};