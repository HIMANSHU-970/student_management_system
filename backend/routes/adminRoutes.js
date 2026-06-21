const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  createCourse,
  deleteUser,
  getStats,
  getCourses,
  // 🆕 naye functions
  getAllTeachers,
  getAllSubjects,
  createSubject,
  assignSubjectToTeacher,
  removeSubjectFromTeacher,
  getAllAssignments
} = require("../controllers/adminController");

const auth = require("../middleware/authMiddleware");

// 👨‍💼 USERS
router.get("/users", auth, getAllUsers);
router.delete("/user/:id", auth, deleteUser);

// 📚 COURSES (OLD - raw SQL, untouched)
router.get("/courses", auth, getCourses);
router.post("/course", auth, createCourse);

// 📊 STATS
router.get("/stats", auth, getStats);

// 🆕 TEACHER-SUBJECT ASSIGNMENT (Sequelize based)
router.get("/teachers", auth, getAllTeachers);
router.get("/subjects", auth, getAllSubjects);
router.post("/subjects", auth, createSubject);
router.post("/assign-subject", auth, assignSubjectToTeacher);
router.delete("/assign-subject/:id", auth, removeSubjectFromTeacher);
router.get("/assignments", auth, getAllAssignments);

module.exports = router;