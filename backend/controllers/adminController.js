const db = require("../config/db");
const { User, Course, TeacherSubject, TeacherProfile } = require("../models/index");

// 👥 GET ALL USERS (UPGRADED) - OLD, untouched
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

// 📚 GET ALL COURSES (NEW + IMPORTANT) - OLD, untouched
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

// ➕ CREATE COURSE (UPGRADED) - OLD, untouched
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

// ❌ DELETE USER (UPGRADED) - OLD, untouched
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

// 📊 SYSTEM STATS (UPGRADED) - OLD, untouched
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

// ==========================================
// 🆕 NEW: SEQUELIZE-BASED FUNCTIONS (Teacher-Subject Assignment ke liye)
// ==========================================

// 👨‍🏫 GET ALL TEACHERS (Sequelize se, with their TeacherProfile)
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.findAll({
      where: { role: "teacher" },
      attributes: ["id", "name", "email"],
      include: [{ model: TeacherProfile, attributes: ["employeeId", "department"] }]
    });

    res.json(teachers);
  } catch (err) {
    console.error("❌ getAllTeachers Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📚 GET ALL SUBJECTS/COURSES (Sequelize se)
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Course.findAll({ order: [["createdAt", "DESC"]] });
    res.json(subjects);
  } catch (err) {
    console.error("❌ getAllSubjects Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ➕ CREATE SUBJECT/COURSE (Sequelize se)
exports.createSubject = async (req, res) => {
  try {
    const { courseCode, courseName, department, credits } = req.body;

    if (!courseCode || !courseName || !department) {
      return res.status(400).json({ message: "courseCode, courseName, department required" });
    }

    const newCourse = await Course.create({
      courseCode,
      courseName,
      department,
      credits: credits || 3
    });

    res.status(201).json({ message: "Subject created successfully", course: newCourse });
  } catch (err) {
    console.error("❌ createSubject Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔗 ASSIGN SUBJECT TO TEACHER
exports.assignSubjectToTeacher = async (req, res) => {
  try {
    const { teacherId, courseId } = req.body;

    if (!teacherId || !courseId) {
      return res.status(400).json({ message: "teacherId and courseId are required" });
    }

    // Verify teacher exists and has role teacher
    const teacher = await User.findOne({ where: { id: teacherId, role: "teacher" } });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Verify course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Subject/Course not found" });
    }

    // Check if already assigned
    const existing = await TeacherSubject.findOne({ where: { teacherId, courseId } });
    if (existing) {
      return res.status(409).json({ message: "This subject is already assigned to this teacher" });
    }

    const assignment = await TeacherSubject.create({ teacherId, courseId });

    res.status(201).json({ message: "Subject assigned successfully", assignment });
  } catch (err) {
    console.error("❌ assignSubjectToTeacher Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ❌ REMOVE SUBJECT FROM TEACHER
exports.removeSubjectFromTeacher = async (req, res) => {
  try {
    const { id } = req.params; // TeacherSubject row id

    const deleted = await TeacherSubject.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json({ message: "Subject removed from teacher successfully" });
  } catch (err) {
    console.error("❌ removeSubjectFromTeacher Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📋 GET ALL TEACHER-SUBJECT ASSIGNMENTS (for admin table view)
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await TeacherSubject.findAll({
      include: [
        { model: User, as: "teacher", attributes: ["id", "name", "email"] },
        { model: Course, as: "course", attributes: ["id", "courseCode", "courseName"] }
      ]
    });

    res.json(assignments);
  } catch (err) {
    console.error("❌ getAllAssignments Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};