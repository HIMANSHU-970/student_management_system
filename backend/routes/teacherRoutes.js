const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
  getStudents,
  markAttendance,
  assignCourse,
  addAssignment,
  getAssignments,
  getMySubjects,
  getMyCourseAttendance,
  updateMyCourseAttendance,
  getStudentAttendanceForMyCourses,
  getTeacherNotices,
  getMyTimetable,
   uploadMaterial,
    getMyMaterials, 
    deleteMaterial,
    getMyExams,
    enterMyExamResult  
} = require("../controllers/teacherController");

const auth = require("../middleware/authMiddleware");

router.get("/students", auth, getStudents);
router.post("/attendance", auth, markAttendance);
router.post("/assign-course", auth, assignCourse);
router.post("/assignment", auth, addAssignment);
router.get("/assignments", auth, getAssignments);
router.get("/my-subjects", auth, getMySubjects);
router.get("/notices", auth, getTeacherNotices);
router.get("/timetable", auth, getMyTimetable);

// ATTENDANCE (own subjects only)
router.get("/my-attendance", auth, getMyCourseAttendance);
router.put("/attendance/:id", auth, updateMyCourseAttendance);
router.get("/student-attendance/:studentId", auth, getStudentAttendanceForMyCourses);

// 🆕 UPLOAD STUDY MATERIAL (sirf apne assigned subject ki)
router.post("/materials", auth, upload.single("file"), uploadMaterial);
router.get("/materials", auth, getMyMaterials);
router.delete("/materials/:id", auth, deleteMaterial);

// 🆕 EXAMS (sirf apne assigned subjects ki)
router.get("/exams", auth, getMyExams);
router.post("/exam-results", auth, enterMyExamResult);


module.exports = router;