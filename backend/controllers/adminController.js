const db = require("../config/db");

// 👥 GET ALL USERS (UPGRADED)
exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, email, role FROM users ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📚 GET ALL COURSES (NEW + IMPORTANT)
exports.getCourses = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM courses ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ➕ CREATE COURSE (UPGRADED)
exports.createCourse = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Course name required" });
    }

    await db.query(
      "INSERT INTO courses (name, description) VALUES ($1, $2)",
      [name, description || ""]
    );

    res.json({ message: "Course created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ❌ DELETE USER (UPGRADED)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const check = await db.query("SELECT * FROM users WHERE id=$1", [id]);

    if (check.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    await db.query("DELETE FROM users WHERE id=$1", [id]);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📊 SYSTEM STATS (UPGRADED)
exports.getStats = async (req, res) => {
  try {
    const users = await db.query("SELECT COUNT(*) FROM users");
    const students = await db.query(
      "SELECT COUNT(*) FROM users WHERE role='student'"
    );
    const teachers = await db.query(
      "SELECT COUNT(*) FROM users WHERE role='teacher'"
    );
    const courses = await db.query("SELECT COUNT(*) FROM courses");

    res.json({
      totalUsers: users.rows[0].count,
      students: students.rows[0].count,
      teachers: teachers.rows[0].count,
      courses: courses.rows[0].count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};