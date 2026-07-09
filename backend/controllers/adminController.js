const { User, Course, TeacherSubject, TeacherProfile, StudentCourse, StudentProfile, Notice, Department, ClassSection, Timetable, Fee, Exam, ExamResult, LeaveApplication } = require("../models/index");

// 👥 GET ALL USERS (FIXED - Sequelize)

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      // Attributes mein 'password' add kar diya hai
      attributes: ["id", "name", "email", "role"], 
      order: [["createdAt", "DESC"]]
    });
    res.json(users);
  } catch (err) {
    console.error("❌ getAllUsers Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// 📚 GET ALL COURSES (FIXED - Sequelize, same as getAllSubjects)
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({ order: [["createdAt", "DESC"]] });
    res.json(courses);
  } catch (err) {
    console.error("❌ getCourses Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ➕ CREATE COURSE (FIXED - Sequelize)
exports.createCourse = async (req, res) => {
  try {
    const { courseCode, courseName, department, credits } = req.body;
    if (!courseCode || !courseName || !department) {
      return res.status(400).json({ message: "courseCode, courseName, department required" });
    }

    const newCourse = await Course.create({
      courseCode, courseName, department, credits: credits || 3
    });

    res.json({ message: "Course created successfully", course: newCourse });
  } catch (err) {
    console.error("❌ createCourse Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ❌ DELETE USER (FIXED - Sequelize)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ deleteUser Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📊 SYSTEM STATS (FIXED - Sequelize)
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const students = await User.count({ where: { role: "student" } });
    const teachers = await User.count({ where: { role: "teacher" } });
    const courses = await Course.count();

    res.json({ totalUsers, students, teachers, courses });
  } catch (err) {
    console.error("❌ getStats Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// 🆕 SEQUELIZE-BASED: Teacher-Subject Assignment
// ==========================================

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

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Course.findAll({ order: [["createdAt", "DESC"]] });
    res.json(subjects);
  } catch (err) {
    console.error("❌ getAllSubjects Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { courseCode, courseName, department, credits } = req.body;
    if (!courseCode || !courseName || !department) {
      return res.status(400).json({ message: "courseCode, courseName, department required" });
    }

    const newCourse = await Course.create({
      courseCode, courseName, department, credits: credits || 3
    });

    res.status(201).json({ message: "Subject created successfully", course: newCourse });
  } catch (err) {
    console.error("❌ createSubject Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.assignSubjectToTeacher = async (req, res) => {
  try {
    const { teacherId, courseId } = req.body;
    if (!teacherId || !courseId) {
      return res.status(400).json({ message: "teacherId and courseId are required" });
    }

    const teacher = await User.findOne({ where: { id: teacherId, role: "teacher" } });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: "Subject/Course not found" });

    const existing = await TeacherSubject.findOne({ where: { teacherId, courseId } });
    if (existing) return res.status(409).json({ message: "This subject is already assigned to this teacher" });

    const assignment = await TeacherSubject.create({ teacherId, courseId });
    res.status(201).json({ message: "Subject assigned successfully", assignment });
  } catch (err) {
    console.error("❌ assignSubjectToTeacher Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeSubjectFromTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TeacherSubject.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Assignment not found" });
    res.json({ message: "Subject removed from teacher successfully" });
  } catch (err) {
    console.error("❌ removeSubjectFromTeacher Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

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

// ==========================================
// 🆕 STUDENT-COURSE ENROLLMENT + ATTENDANCE OVERRIDE (Admin Full Control)
// ==========================================

exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.findAll({
      where: { role: "student" },
      attributes: ["id", "name", "email"],
      include: [{ model: StudentProfile, attributes: ["rollNumber", "department", "semester"] }]
    });
    res.json(students);
  } catch (err) {
    console.error("❌ getAllStudents Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.enrollStudentInCourse = async (req, res) => {
  try {
    const { studentId, courseId, total } = req.body;
    if (!studentId || !courseId) {
      return res.status(400).json({ message: "studentId and courseId required" });
    }

    const existing = await StudentCourse.findOne({ where: { studentId, courseId } });
    if (existing) return res.status(409).json({ message: "Student already enrolled in this subject" });

    const enrollment = await StudentCourse.create({
      studentId, courseId, present: 0, total: total || 0
    });

    res.status(201).json({ message: "Student enrolled successfully", enrollment });
  } catch (err) {
    console.error("❌ enrollStudentInCourse Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStudentAttendanceOverview = async (req, res) => {
  try {
    const { studentId } = req.params;
    const records = await StudentCourse.findAll({
      where: { studentId },
      include: [{ model: Course, as: "course", attributes: ["id", "courseCode", "courseName"] }]
    });
    res.json(records);
  } catch (err) {
    console.error("❌ getStudentAttendanceOverview Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateAttendanceOverride = async (req, res) => {
  try {
    const { id } = req.params;
    const { present, total } = req.body;

    const record = await StudentCourse.findByPk(id);
    if (!record) return res.status(404).json({ message: "Enrollment record not found" });

    if (present !== undefined) record.present = present;
    if (total !== undefined) record.total = total;
    await record.save();

    res.json({ message: "Attendance updated successfully", record });
  } catch (err) {
    console.error("❌ updateAttendanceOverride Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllAttendanceRecords = async (req, res) => {
  try {
    const records = await StudentCourse.findAll({
      include: [
        {
          model: User,
          as: "student",
          attributes: ["id", "name", "email"],
          include: [{ model: StudentProfile, attributes: ["department", "rollNumber"] }]
        },
        { model: Course, as: "course", attributes: ["id", "courseCode", "courseName"] }
      ]
    });
    res.json(records);
  } catch (err) {
    console.error("❌ getAllAttendanceRecords Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// 🆕 NOTICE MANAGEMENT
// ==========================================

exports.createNotice = async (req, res) => {
  try {
    const { title, content, targetRole } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "title and content required" });
    }

    const notice = await Notice.create({
      title,
      content,
      targetRole: targetRole || "all",
      createdById: req.user.id
    });

    res.status(201).json({ message: "Notice published successfully", notice });
  } catch (err) {
    console.error("❌ createNotice Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.findAll({
      include: [{ model: User, attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]]
    });
    res.json(notices);
  } catch (err) {
    console.error("❌ getAllNotices Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notice.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Notice not found" });
    res.json({ message: "Notice deleted successfully" });
  } catch (err) {
    console.error("❌ deleteNotice Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// 🆕 DEPARTMENT MANAGEMENT
// ==========================================

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({ order: [["createdAt", "DESC"]] });
    res.json(departments);
  } catch (err) {
    console.error("❌ getAllDepartments Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { name, code } = req.body;
    if (!name || !code) return res.status(400).json({ message: "name and code required" });

    const dept = await Department.create({ name, code });
    res.status(201).json({ message: "Department created successfully", department: dept });
  } catch (err) {
    console.error("❌ createDepartment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;

    const dept = await Department.findByPk(id);
    if (!dept) return res.status(404).json({ message: "Department not found" });

    if (name) dept.name = name;
    if (code) dept.code = code;
    await dept.save();

    res.json({ message: "Department updated successfully", department: dept });
  } catch (err) {
    console.error("❌ updateDepartment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Department.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Department not found" });
    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    console.error("❌ deleteDepartment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// 🆕 CLASS / SECTION MANAGEMENT
// ==========================================

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await ClassSection.findAll({
      include: [
        { model: Department, as: "department", attributes: ["id", "name", "code"] },
        { model: User, as: "classTeacher", attributes: ["id", "name", "email"] }
      ],
      order: [["createdAt", "DESC"]]
    });
    res.json(classes);
  } catch (err) {
    console.error("❌ getAllClasses Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { name, departmentId, year, section, classTeacherId } = req.body;
    if (!name || !departmentId) {
      return res.status(400).json({ message: "name and departmentId required" });
    }

    const newClass = await ClassSection.create({
      name, departmentId, year: year || 1, section: section || "A", classTeacherId: classTeacherId || null
    });

    res.status(201).json({ message: "Class created successfully", class: newClass });
  } catch (err) {
    console.error("❌ createClass Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, year, section, classTeacherId } = req.body;

    const cls = await ClassSection.findByPk(id);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    if (name) cls.name = name;
    if (year) cls.year = year;
    if (section) cls.section = section;
    if (classTeacherId !== undefined) cls.classTeacherId = classTeacherId;
    await cls.save();

    res.json({ message: "Class updated successfully", class: cls });
  } catch (err) {
    console.error("❌ updateClass Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ClassSection.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Class not found" });
    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    console.error("❌ deleteClass Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// 🆕 TIMETABLE MANAGEMENT
// ==========================================

exports.getAllTimetable = async (req, res) => {
  try {
    const slots = await Timetable.findAll({
      include: [
        { model: Course, as: "course", attributes: ["id", "courseCode", "courseName"] },
        { model: User, as: "teacher", attributes: ["id", "name"] }
      ],
      order: [["day", "ASC"], ["time", "ASC"]]
    });
    res.json(slots);
  } catch (err) {
    console.error("❌ getAllTimetable Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createTimetableSlot = async (req, res) => {
  try {
    const { day, time, courseId, teacherId } = req.body;
    if (!day || !time || !courseId || !teacherId) {
      return res.status(400).json({ message: "day, time, courseId, teacherId required" });
    }

    const slot = await Timetable.create({ day, time, courseId, teacherId });
    res.status(201).json({ message: "Slot added successfully", slot });
  } catch (err) {
    console.error("❌ createTimetableSlot Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTimetableSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Timetable.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Slot not found" });
    res.json({ message: "Slot deleted successfully" });
  } catch (err) {
    console.error("❌ deleteTimetableSlot Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// 🆕 FEE MANAGEMENT
// ==========================================

exports.getAllFees = async (req, res) => {
  try {
    const fees = await Fee.findAll({
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]]
    });
    res.json(fees);
  } catch (err) {
    console.error("❌ getAllFees Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createFee = async (req, res) => {
  try {
    const { studentId, term, amount, dueDate, status } = req.body;
    if (!studentId || !term || !amount || !dueDate) {
      return res.status(400).json({ message: "studentId, term, amount, dueDate required" });
    }

    const student = await User.findOne({ where: { id: studentId, role: "student" } });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const fee = await Fee.create({
      studentId, term, amount, dueDate, status: status || "Unpaid"
    });

    res.status(201).json({ message: "Fee record created successfully", fee });
  } catch (err) {
    console.error("❌ createFee Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, status, transactionId, dueDate } = req.body;

    const fee = await Fee.findByPk(id);
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    if (amount !== undefined) fee.amount = amount;
    if (status !== undefined) fee.status = status;
    if (transactionId !== undefined) fee.transactionId = transactionId;
    if (dueDate !== undefined) fee.dueDate = dueDate;
    await fee.save();

    res.json({ message: "Fee record updated successfully", fee });
  } catch (err) {
    console.error("❌ updateFee Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteFee = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Fee.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Fee record not found" });
    res.json({ message: "Fee record deleted successfully" });
  } catch (err) {
    console.error("❌ deleteFee Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// 🆕 EXAM MANAGEMENT
// ==========================================

exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({
      include: [{ model: Course, as: "course", attributes: ["id", "courseCode", "courseName"] }],
      order: [["examDate", "ASC"]]
    });
    res.json(exams);
  } catch (err) {
    console.error("❌ getAllExams Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createExam = async (req, res) => {
  try {
    const { examName, courseId, examDate, maxMarks } = req.body;
    if (!examName || !courseId || !examDate) {
      return res.status(400).json({ message: "examName, courseId, examDate required" });
    }

    const exam = await Exam.create({ examName, courseId, examDate, maxMarks: maxMarks || 100 });
    res.status(201).json({ message: "Exam created successfully", exam });
  } catch (err) {
    console.error("❌ createExam Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Exam.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Exam not found" });
    res.json({ message: "Exam deleted successfully" });
  } catch (err) {
    console.error("❌ deleteExam Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 ENTER/UPDATE MARKS (admin full control)
exports.enterExamResult = async (req, res) => {
  try {
    const { examId, studentId, marksObtained } = req.body;
    if (!examId || !studentId || marksObtained === undefined) {
      return res.status(400).json({ message: "examId, studentId, marksObtained required" });
    }

    let result = await ExamResult.findOne({ where: { examId, studentId } });
    if (result) {
      result.marksObtained = marksObtained;
      await result.save();
    } else {
      result = await ExamResult.create({ examId, studentId, marksObtained });
    }

    res.json({ message: "Result saved successfully", result });
  } catch (err) {
    console.error("❌ enterExamResult Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 PUBLISH RESULTS (bulk toggle for an exam)
exports.publishExamResults = async (req, res) => {
  try {
    const { examId } = req.params;
    await ExamResult.update({ published: true }, { where: { examId } });
    res.json({ message: "Results published successfully" });
  } catch (err) {
    console.error("❌ publishExamResults Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 GET ALL RESULTS for an exam (admin view, regardless of published status)
exports.getExamResults = async (req, res) => {
  try {
    const { examId } = req.params;
    const results = await ExamResult.findAll({
      where: { examId },
      include: [{ model: User, as: "student", attributes: ["id", "name", "email"] }]
    });
    res.json(results);
  } catch (err) {
    console.error("❌ getExamResults Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// 🆕 LEAVE MANAGEMENT
// ==========================================

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await LeaveApplication.findAll({
      include: [{ model: User, as: "student", attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]]
    });
    res.json(leaves);
  } catch (err) {
    console.error("❌ getAllLeaves Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await LeaveApplication.findByPk(id);
    if (!leave) return res.status(404).json({ message: "Leave application not found" });

    leave.status = status;
    leave.reviewedById = req.user.id;
    await leave.save();

    res.json({ message: `Leave ${status.toLowerCase()} successfully`, leave });
  } catch (err) {
    console.error("❌ updateLeaveStatus Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Password ko hash karna zaroori hai
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    user.password = hashedPassword;
    await user.save();
    
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};