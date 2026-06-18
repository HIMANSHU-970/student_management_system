const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// 🔥 Mark Attendance (Teacher)
router.post("/mark", async (req, res) => {
  const { student_id, status, date } = req.body;

  try {
    await pool.query(
      "INSERT INTO attendance (student_id, status, date) VALUES ($1, $2, $3)",
      [student_id, status, date]
    );

    res.json({ message: "Attendance marked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 Get Student Attendance
router.get("/:student_id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM attendance WHERE student_id=$1",
      [req.params.student_id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;