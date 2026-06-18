const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// कंट्रोलर से फंक्शन्स को इम्पोर्ट करें
const { 
    getStudentProfile, 
    updateStudentProfile, 
    getStudentAttendance, 
    getStudentFees, 
    getStudentCourses 
} = require('../controllers/studentController');

// Roles validation
router.use(protect, authorize('student'));

// Routes definitions
router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.get('/attendance', getStudentAttendance);
router.get('/fees', getStudentFees);
router.get('/courses', getStudentCourses);

module.exports = router;