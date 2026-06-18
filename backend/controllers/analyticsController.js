const db = require("../config/db");

// 📊 ATTENDANCE OVERVIEW
exports.getAttendanceStats = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT course_id,
      COUNT(*) FILTER (WHERE status='present') * 100.0 / COUNT(*) AS percentage
      FROM attendance
      GROUP BY course_id
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 📚 TOP COURSES (MOST STUDENTS)
exports.getCoursePopularity = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.name, COUNT(sc.student_id) as students
      FROM courses c
      LEFT JOIN student_courses sc ON c.id = sc.course_id
      GROUP BY c.name
      ORDER BY students DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 👥 USER DISTRIBUTION
exports.getUserDistribution = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT role, COUNT(*) 
      FROM users 
      GROUP BY role
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};