const sequelize = require("../config/db");

const User = require("./User");
const StudentProfile = require("./StudentProfile");
const TeacherProfile = require("./TeacherProfile");
const Attendance = require("./Attendance");
const Assignment = require("./Assignment");
const Exam = require("./Exam");
const Notice = require("./Notice");
const Fee = require("./Fee");
const Course = require("./Course");
const TeacherSubject = require("./TeacherSubject");
const StudentCourse = require("./StudentCourse");
const Department = require("./Department");
const ClassSection = require("./ClassSection");
const Timetable = require("./Timetable");
const StudyMaterial = require("./StudyMaterial");
const ExamResult = require("./ExamResult");
const LeaveApplication = require("./LeaveApplication");
const Message = require("./Message");

// ================= ASSOCIATIONS =================

User.hasOne(StudentProfile, { foreignKey: "userId", onDelete: "CASCADE" });
StudentProfile.belongsTo(User, { foreignKey: "userId" });

User.hasOne(TeacherProfile, { foreignKey: "userId", onDelete: "CASCADE" });
TeacherProfile.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Attendance, { foreignKey: "studentId", onDelete: "CASCADE" });
Attendance.belongsTo(User, { foreignKey: "studentId" });

User.hasMany(Assignment, { foreignKey: "teacherId", onDelete: "CASCADE" });
Assignment.belongsTo(User, { foreignKey: "teacherId" });


User.hasMany(Notice, { foreignKey: "createdById", onDelete: "CASCADE" });
Notice.belongsTo(User, { foreignKey: "createdById" });

User.hasMany(Fee, { foreignKey: "studentId", onDelete: "CASCADE" });
Fee.belongsTo(User, { foreignKey: "studentId" });

// 🆕 MESSAGE <-> SENDER/RECEIVER
User.hasMany(Message, { foreignKey: "senderId", as: "sentMessages", onDelete: "CASCADE" });
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });

User.hasMany(Message, { foreignKey: "receiverId", as: "receivedMessages", onDelete: "CASCADE" });
Message.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

// TEACHER <-> SUBJECT
User.hasMany(TeacherSubject, { foreignKey: "teacherId", onDelete: "CASCADE" });
TeacherSubject.belongsTo(User, { foreignKey: "teacherId", as: "teacher" });
Course.hasMany(TeacherSubject, { foreignKey: "courseId", onDelete: "CASCADE" });
TeacherSubject.belongsTo(Course, { foreignKey: "courseId", as: "course" });

// ATTENDANCE (daily log) <-> COURSE
Course.hasMany(Attendance, { foreignKey: "courseId", onDelete: "CASCADE" });
Attendance.belongsTo(Course, { foreignKey: "courseId", as: "course" });

// ASSIGNMENT <-> COURSE
Course.hasMany(Assignment, { foreignKey: "courseId", onDelete: "CASCADE" });
Assignment.belongsTo(Course, { foreignKey: "courseId", as: "course" });

// STUDENT <-> COURSE ENROLLMENT
User.hasMany(StudentCourse, { foreignKey: "studentId", onDelete: "CASCADE" });
StudentCourse.belongsTo(User, { foreignKey: "studentId", as: "student" });
Course.hasMany(StudentCourse, { foreignKey: "courseId", onDelete: "CASCADE" });
StudentCourse.belongsTo(Course, { foreignKey: "courseId", as: "course" });

// 🆕 DEPARTMENT <-> CLASS SECTION
Department.hasMany(ClassSection, { foreignKey: "departmentId", onDelete: "CASCADE" });
ClassSection.belongsTo(Department, { foreignKey: "departmentId", as: "department" });

// 🆕 CLASS SECTION <-> CLASS TEACHER (User)
User.hasMany(ClassSection, { foreignKey: "classTeacherId" });
ClassSection.belongsTo(User, { foreignKey: "classTeacherId", as: "classTeacher" });

// 🆕 TIMETABLE <-> COURSE & TEACHER
Course.hasMany(Timetable, { foreignKey: "courseId", onDelete: "CASCADE" });
Timetable.belongsTo(Course, { foreignKey: "courseId", as: "course" });

User.hasMany(Timetable, { foreignKey: "teacherId", onDelete: "CASCADE" });
Timetable.belongsTo(User, { foreignKey: "teacherId", as: "teacher" });

// 🆕 STUDY MATERIAL <-> COURSE & UPLOADER
Course.hasMany(StudyMaterial, { foreignKey: "courseId", onDelete: "CASCADE" });
StudyMaterial.belongsTo(Course, { foreignKey: "courseId", as: "course" });

User.hasMany(StudyMaterial, { foreignKey: "uploadedById", onDelete: "CASCADE" });
StudyMaterial.belongsTo(User, { foreignKey: "uploadedById", as: "uploadedBy" });

// 🆕 EXAM <-> COURSE
Course.hasMany(Exam, { foreignKey: "courseId", onDelete: "CASCADE" });
Exam.belongsTo(Course, { foreignKey: "courseId", as: "course" });

// 🆕 EXAM <-> EXAM RESULT <-> STUDENT
Exam.hasMany(ExamResult, { foreignKey: "examId", onDelete: "CASCADE" });
ExamResult.belongsTo(Exam, { foreignKey: "examId", as: "exam" });

User.hasMany(ExamResult, { foreignKey: "studentId", onDelete: "CASCADE" });
ExamResult.belongsTo(User, { foreignKey: "studentId", as: "student" });

// 🆕 LEAVE APPLICATION <-> STUDENT & REVIEWER
User.hasMany(LeaveApplication, { foreignKey: "studentId", onDelete: "CASCADE" });
LeaveApplication.belongsTo(User, { foreignKey: "studentId", as: "student" });

User.hasMany(LeaveApplication, { foreignKey: "reviewedById" });
LeaveApplication.belongsTo(User, { foreignKey: "reviewedById", as: "reviewedBy" });

module.exports = {
  sequelize,
  User,
  StudentProfile,
  TeacherProfile,
  Attendance,
  Assignment,
  Exam,
  Notice,
  Fee,
  Course,
  TeacherSubject,
  StudentCourse,
  Department,
  ClassSection,
  Timetable,
  StudyMaterial,
  ExamResult,
  LeaveApplication,
  Message,
};