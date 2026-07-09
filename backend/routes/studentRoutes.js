const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const {
    getStudentProfile,
    updateStudentProfile,
    getStudentAttendance,
    getStudentAttendanceOverview,
    getStudentFees,
    getStudentCourses,
    getStudentNotices,
    getStudentTimetable,
    getStudentMaterials,
    getStudentExams,
    getStudentResults,
    applyLeave,
    getMyLeaves
} = require('../controllers/studentController');

router.use(protect, authorize('student'));

router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.get('/attendance', getStudentAttendance);
router.get('/attendance-overview', getStudentAttendanceOverview); // 🆕
router.get('/fees', getStudentFees);
router.get('/courses', getStudentCourses);
router.get('/notices', getStudentNotices); 
router.get('/timetable', getStudentTimetable);
router.get('/materials', getStudentMaterials);
router.get('/exams', getStudentExams);
router.get('/results', getStudentResults);
router.post('/leave', applyLeave);
router.get('/leave', getMyLeaves);


module.exports = router;