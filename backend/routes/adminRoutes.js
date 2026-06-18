const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  createCourse,
  deleteUser,
  getStats,
  getCourses
} = require("../controllers/adminController");

const auth = require("../middleware/authMiddleware");

// 👨‍💼 USERS
router.get("/users", auth, getAllUsers);
router.delete("/user/:id", auth, deleteUser);

// 📚 COURSES
router.get("/courses", auth, getCourses);
router.post("/course", auth, createCourse);

// 📊 STATS
router.get("/stats", auth, getStats);

module.exports = router;