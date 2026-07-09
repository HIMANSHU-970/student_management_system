const db = require("../config/db");
const { Attendance, Assignment, TeacherSubject, Course, User, StudentProfile, StudentCourse, Notice, Timetable, StudyMaterial, Exam, ExamResult } = require("../models/index");

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

// 📊 MARK ATTENDANCE (daily log) - REWRITTEN with Sequelize + ownership check
exports.markAttendance = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { student_id, course_id, status, date } = req.body;

    if (!student_id || !course_id || !status) {
      return res.status(400).json({ message: "Missing fields" });
    }

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

// 📚 ASSIGN COURSE - OLD, untouched
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

// 📝 CREATE ASSIGNMENT - REWRITTEN with Sequelize + ownership check
exports.addAssignment = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { title, description, course_id, due_date, file_url } = req.body;

    if (!title || !course_id || !due_date) {
      return res.status(400).json({ message: "title, course_id, due_date required" });
    }

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

// 📋 GET ASSIGNMENTS - REWRITTEN with Sequelize (apne diye hue assignments)
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

// 🆕 TEACHER: GET ATTENDANCE - sirf apne assigned subjects ki (sab students)
exports.getMyCourseAttendance = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const myCourses = await TeacherSubject.findAll({ where: { teacherId } });
    const courseIds = myCourses.map((c) => c.courseId);

    if (courseIds.length === 0) return res.json([]);

    const records = await StudentCourse.findAll({
      where: { courseId: courseIds },
      include: [
        { model: User, as: "student", attributes: ["id", "name", "email"] },
        { model: Course, as: "course", attributes: ["id", "courseCode", "courseName"] }
      ]
    });

    res.json(records);
  } catch (err) {
    console.error("❌ getMyCourseAttendance Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 TEACHER: UPDATE ATTENDANCE - sirf apne assigned subject ki (ownership check)
exports.updateMyCourseAttendance = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id } = req.params;
    const { present, total } = req.body;

    const record = await StudentCourse.findByPk(id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    const owns = await isTeacherOwnsCourse(teacherId, record.courseId);
    if (!owns) {
      return res.status(403).json({ message: "You are not assigned to this subject" });
    }

    if (present !== undefined) record.present = present;
    if (total !== undefined) record.total = total;
    await record.save();

    res.json({ message: "Attendance updated successfully", record });
  } catch (err) {
    console.error("❌ updateMyCourseAttendance Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 TEACHER: GET ek specific student ki attendance, sirf apne assigned subjects ki
exports.getStudentAttendanceForMyCourses = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { studentId } = req.params;

    const myCourses = await TeacherSubject.findAll({ where: { teacherId } });
    const courseIds = myCourses.map((c) => c.courseId);

    if (courseIds.length === 0) return res.json([]);

    const records = await StudentCourse.findAll({
      where: { studentId, courseId: courseIds },
      include: [{ model: Course, as: "course", attributes: ["id", "courseCode", "courseName"] }]
    });

    res.json(records);
  } catch (err) {
    console.error("❌ getStudentAttendanceForMyCourses Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 Get Notices (sirf teacher/all wale)
exports.getTeacherNotices = async (req, res) => {
  try {
    const notices = await Notice.findAll({
      where: { targetRole: ["all", "teacher"] },
      order: [["createdAt", "DESC"]]
    });
    res.json(notices);
  } catch (err) {
    console.error("❌ getTeacherNotices Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 TEACHER: (timetable)
exports.getMyTimetable = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const slots = await Timetable.findAll({
      where: { teacherId },
      include: [{ model: Course, as: "course", attributes: ["id", "courseCode", "courseName"] }],
      order: [["day", "ASC"], ["time", "ASC"]]
    });
    res.json(slots);
  } catch (err) {
    console.error("❌ getMyTimetable Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 UPLOAD STUDY MATERIAL (sirf apne assigned subject ki)
exports.uploadMaterial = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { title, type, courseId } = req.body;

    if (!title || !courseId || !req.file) {
      return res.status(400).json({ message: "title, courseId, and file are required" });
    }

    const owns = await isTeacherOwnsCourse(teacherId, courseId);
    if (!owns) {
      return res.status(403).json({ message: "You are not assigned to this subject" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const material = await StudyMaterial.create({
      title, type: type || "other", fileUrl, courseId, uploadedById: teacherId
    });

    res.status(201).json({ message: "Material uploaded successfully", material });
  } catch (err) {
    console.error("❌ uploadMaterial Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 GET MY UPLOADED MATERIALS
exports.getMyMaterials = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const materials = await StudyMaterial.findAll({
      where: { uploadedById: teacherId },
      include: [{ model: Course, as: "course", attributes: ["courseCode", "courseName"] }],
      order: [["createdAt", "DESC"]]
    });
    res.json(materials);
  } catch (err) {
    console.error("❌ getMyMaterials Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 DELETE MATERIAL (sirf apni uploaded wali)
exports.deleteMaterial = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id } = req.params;

    const material = await StudyMaterial.findOne({ where: { id, uploadedById: teacherId } });
    if (!material) return res.status(404).json({ message: "Material not found or not yours" });

    await material.destroy();
    res.json({ message: "Material deleted successfully" });
  } catch (err) {
    console.error("❌ deleteMaterial Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 TEACHER: Apne subject ke exams dekhna
exports.getMyExams = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const myCourses = await TeacherSubject.findAll({ where: { teacherId } });
    const courseIds = myCourses.map((c) => c.courseId);

    if (courseIds.length === 0) return res.json([]);

    const exams = await Exam.findAll({
      where: { courseId: courseIds },
      include: [{ model: Course, as: "course", attributes: ["courseCode", "courseName"] }],
      order: [["examDate", "ASC"]]
    });
    res.json(exams);
  } catch (err) {
    console.error("❌ getMyExams Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 TEACHER: Marks enter karna (sirf apne subject ke exam ki, ownership check)
exports.enterMyExamResult = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { examId, studentId, marksObtained } = req.body;

    if (!examId || !studentId || marksObtained === undefined) {
      return res.status(400).json({ message: "examId, studentId, marksObtained required" });
    }

    const exam = await Exam.findByPk(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    const owns = await isTeacherOwnsCourse(teacherId, exam.courseId);
    if (!owns) return res.status(403).json({ message: "You are not assigned to this subject" });

    let result = await ExamResult.findOne({ where: { examId, studentId } });
    if (result) {
      result.marksObtained = marksObtained;
      await result.save();
    } else {
      result = await ExamResult.create({ examId, studentId, marksObtained });
    }

    res.json({ message: "Result saved successfully", result });
  } catch (err) {
    console.error("❌ enterMyExamResult Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};