const express = require("express");
const router = express.Router();

const {
  getAttendanceStats,
  getCoursePopularity,
  getUserDistribution
} = require("../controllers/analyticsController");

const auth = require("../middleware/authMiddleware");

// 📊 ANALYTICS APIs
router.get("/attendance", auth, getAttendanceStats);
router.get("/courses", auth, getCoursePopularity);
router.get("/users", auth, getUserDistribution);

module.exports = router;