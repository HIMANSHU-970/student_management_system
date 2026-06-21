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

// ================= ASSOCIATIONS =================

User.hasOne(StudentProfile, { foreignKey: "userId", onDelete: "CASCADE" });
StudentProfile.belongsTo(User, { foreignKey: "userId" });

User.hasOne(TeacherProfile, { foreignKey: "userId", onDelete: "CASCADE" });
TeacherProfile.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Attendance, { foreignKey: "studentId", onDelete: "CASCADE" });
Attendance.belongsTo(User, { foreignKey: "studentId" });

User.hasMany(Assignment, { foreignKey: "teacherId", onDelete: "CASCADE" });
Assignment.belongsTo(User, { foreignKey: "teacherId" });

User.hasMany(Exam, { foreignKey: "studentId", onDelete: "CASCADE" });
Exam.belongsTo(User, { foreignKey: "studentId" });

User.hasMany(Notice, { foreignKey: "createdById", onDelete: "CASCADE" });
Notice.belongsTo(User, { foreignKey: "createdById" });

User.hasMany(Fee, { foreignKey: "studentId", onDelete: "CASCADE" });
Fee.belongsTo(User, { foreignKey: "studentId" });

// TEACHER <-> SUBJECT (COURSE) ASSOCIATIONS
User.hasMany(TeacherSubject, { foreignKey: "teacherId", onDelete: "CASCADE" });
TeacherSubject.belongsTo(User, { foreignKey: "teacherId", as: "teacher" });

Course.hasMany(TeacherSubject, { foreignKey: "courseId", onDelete: "CASCADE" });
TeacherSubject.belongsTo(Course, { foreignKey: "courseId", as: "course" });

// 🆕 ATTENDANCE <-> COURSE
Course.hasMany(Attendance, { foreignKey: "courseId", onDelete: "CASCADE" });
Attendance.belongsTo(Course, { foreignKey: "courseId", as: "course" });

// 🆕 ASSIGNMENT <-> COURSE
Course.hasMany(Assignment, { foreignKey: "courseId", onDelete: "CASCADE" });
Assignment.belongsTo(Course, { foreignKey: "courseId", as: "course" });

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
};