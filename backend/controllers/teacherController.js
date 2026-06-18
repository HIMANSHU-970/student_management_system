const db = require("../config/db");

// 👨‍🏫 GET ALL STUDENTS
exports.getStudents = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, email FROM users WHERE role=$1 ORDER BY id DESC",
      ["student"]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📊 MARK ATTENDANCE
exports.markAttendance = async (req, res) => {
  try {
    const { student_id, course_id, status } = req.body;

    if (!student_id || !course_id || !status) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await db.query(
      `INSERT INTO attendance (student_id, course_id, status, date)
       VALUES ($1, $2, $3, NOW())`,
      [student_id, course_id, status]
    );

    res.json({ message: "Attendance marked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📚 ASSIGN COURSE
exports.assignCourse = async (req, res) => {
  try {
    const { student_id, course_id } = req.body;

    if (!student_id || !course_id) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const check = await db.query(
      "SELECT * FROM student_courses WHERE student_id=$1 AND course_id=$2",
      [student_id, course_id]
    );

    if (check.rows.length > 0) {
      return res.status(409).json({ message: "Course already assigned" });
    }

    await db.query(
      `INSERT INTO student_courses (student_id, course_id)
       VALUES ($1, $2)`,
      [student_id, course_id]
    );

    res.json({ message: "Course assigned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📝 CREATE ASSIGNMENT
exports.addAssignment = async (req, res) => {
  try {
    const { title, description, course_id } = req.body;

    if (!title || !course_id) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await db.query(
      `INSERT INTO assignments (title, description, course_id, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [title, description || "", course_id]
    );

    res.json({ message: "Assignment created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📋 GET ASSIGNMENTS
exports.getAssignments = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM assignments ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};