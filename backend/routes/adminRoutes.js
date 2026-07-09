const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  createCourse,
  deleteUser,
  getStats,
  getCourses,
  getAllTeachers,
  getAllSubjects,
  createSubject,
  assignSubjectToTeacher,
  removeSubjectFromTeacher,
  getAllAssignments,
  // 🆕
  getAllStudents,
  enrollStudentInCourse,
  getStudentAttendanceOverview,
  updateAttendanceOverride,
  getAllAttendanceRecords,
  createNotice,
  getAllNotices,
  deleteNotice,
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
  getAllTimetable,
  createTimetableSlot,
  deleteTimetableSlot,
  getAllFees,
  createFee,
  updateFee,
  deleteFee,
  getAllExams,
  createExam,
  deleteExam,
  enterExamResult,
  publishExamResults,
  getExamResults,
  getAllLeaves,
  updateLeaveStatus,
  resetPassword
} = require("../controllers/adminController");

const auth = require("../middleware/authMiddleware");

// 👨‍💼 USERS
router.get("/users", auth, getAllUsers);
router.delete("/user/:id", auth, deleteUser);

// 📚 COURSES (OLD raw SQL, untouched)
router.get("/courses", auth, getCourses);
router.post("/course", auth, createCourse);

// 📊 STATS
router.get("/stats", auth, getStats);

// TEACHER-SUBJECT ASSIGNMENT
router.get("/teachers", auth, getAllTeachers);
router.get("/subjects", auth, getAllSubjects);
router.post("/subjects", auth, createSubject);
router.post("/assign-subject", auth, assignSubjectToTeacher);
router.delete("/assign-subject/:id", auth, removeSubjectFromTeacher);
router.get("/assignments", auth, getAllAssignments);

// 🆕 STUDENT-COURSE ENROLLMENT + ATTENDANCE
router.get("/students", auth, getAllStudents);
router.post("/enroll-student", auth, enrollStudentInCourse);
router.get("/student-attendance/:studentId", auth, getStudentAttendanceOverview);
router.put("/attendance-override/:id", auth, updateAttendanceOverride);
router.get("/attendance-all", auth, getAllAttendanceRecords);

// 🆕 NOTICES
router.post("/notices", auth, createNotice);
router.get("/notices", auth, getAllNotices);
router.delete("/notices/:id", auth, deleteNotice);

// 🆕 DEPARTMENTS
router.get("/departments", auth, getAllDepartments);
router.post("/departments", auth, createDepartment);
router.put("/departments/:id", auth, updateDepartment);
router.delete("/departments/:id", auth, deleteDepartment);

// 🆕 CLASSES/SECTIONS
router.get("/classes", auth, getAllClasses);
router.post("/classes", auth, createClass);
router.put("/classes/:id", auth, updateClass);
router.delete("/classes/:id", auth, deleteClass);

// 🆕 TIMETABLE
router.get("/timetable", auth, getAllTimetable);
router.post("/timetable", auth, createTimetableSlot);
router.delete("/timetable/:id", auth, deleteTimetableSlot);

// 🆕 FEES
router.get("/fees", auth, getAllFees);
router.post("/fees", auth, createFee);
router.put("/fees/:id", auth, updateFee);
router.delete("/fees/:id", auth, deleteFee);

// 🆕 EXAMS
router.get("/exams", auth, getAllExams);
router.post("/exams", auth, createExam);
router.delete("/exams/:id", auth, deleteExam);
router.post("/exam-results", auth, enterExamResult);
router.put("/exams/:examId/publish", auth, publishExamResults);
router.get("/exams/:examId/results", auth, getExamResults);

// 🆕 LEAVE MANAGEMENT
router.get("/leaves", auth, getAllLeaves);
router.put("/leaves/:id", auth, updateLeaveStatus);

//🆕 PASSWORD RESET
router.put("/reset-password/:id", auth, resetPassword);


module.exports = router;