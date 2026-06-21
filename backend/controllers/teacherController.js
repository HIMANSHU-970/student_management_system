const db = require("../config/db");
const { Attendance, Assignment, TeacherSubject, Course, User, StudentProfile } = require("../models/index");

// 🔒 HELPER: Verify teacher is assigned to this course
const isTeacherOwnsCourse = async (teacherId, courseId) => {
  const link = await TeacherSubject.findOne({ where: { teacherId, courseId } });
  return !!link;
};

// 👨‍🏫 GET ALL STUDENTS - OLD, untouched
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

// 📊 MARK ATTENDANCE - 🆕 REWRITTEN with Sequelize + ownership check
exports.markAttendance = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { student_id, course_id, status, date } = req.body;

    if (!student_id || !course_id || !status) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 🔒 SECURITY: Teacher sirf apne assigned subject ki attendance de sakta hai
    const owns = await isTeacherOwnsCourse(teacherId, course_id);
    if (!owns) {
      return res.status(403).json({ message: "You are not assigned to this subject. Cannot mark attendance." });
    }

    const attendance = await Attendance.create({
      studentId: student_id,
      courseId: course_id,
      status,
      date: date || new Date()
    });

    res.json({ message: "Attendance marked successfully", attendance });
  } catch (err) {
    console.error("❌ markAttendance Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📚 ASSIGN COURSE (student ko course se jodna) - OLD, untouched (alag concern hai)
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

// 📝 CREATE ASSIGNMENT - 🆕 REWRITTEN with Sequelize + ownership check
exports.addAssignment = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { title, description, course_id, due_date, file_url } = req.body;

    if (!title || !course_id || !due_date) {
      return res.status(400).json({ message: "title, course_id, due_date required" });
    }

    // 🔒 SECURITY: Teacher sirf apne assigned subject ki assignment de sakta hai
    const owns = await isTeacherOwnsCourse(teacherId, course_id);
    if (!owns) {
      return res.status(403).json({ message: "You are not assigned to this subject. Cannot create assignment." });
    }

    const assignment = await Assignment.create({
      teacherId,
      courseId: course_id,
      title,
      description: description || "",
      dueDate: due_date,
      fileUrl: file_url || null
    });

    res.json({ message: "Assignment created successfully", assignment });
  } catch (err) {
    console.error("❌ addAssignment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📋 GET ASSIGNMENTS - 🆕 REWRITTEN with Sequelize (apne diye hue assignments)
exports.getAssignments = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const assignments = await Assignment.findAll({
      where: { teacherId },
      include: [{ model: Course, as: "course", attributes: ["courseCode", "courseName"] }],
      order: [["createdAt", "DESC"]]
    });

    res.json(assignments);
  } catch (err) {
    console.error("❌ getAssignments Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 Apne assigned subjects fetch karna
exports.getMySubjects = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const assignments = await TeacherSubject.findAll({
      where: { teacherId },
      include: [{ model: Course, as: "course" }]
    });

    const subjects = assignments.map((a) => a.course);

    res.json(subjects);
  } catch (err) {
    console.error("❌ getMySubjects Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};