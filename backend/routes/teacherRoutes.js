const express = require("express");
const router = express.Router();

const {
  getStudents,
  markAttendance,
  assignCourse,
  addAssignment,
  getAssignments
} = require("../controllers/teacherController");

const auth = require("../middleware/authMiddleware");

// 👨‍🏫 TEACHER CORE APIs
router.get("/students", auth, getStudents);

router.post("/attendance", auth, markAttendance);

router.post("/assign-course", auth, assignCourse);

// 📝 ASSIGNMENTS
router.post("/assignment", auth, addAssignment);
router.get("/assignments", auth, getAssignments);

module.exports = router;