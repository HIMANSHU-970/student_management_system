const sequelize = require("../config/db");

const User = require("./User");
const StudentProfile = require("./StudentProfile");
const TeacherProfile = require("./TeacherProfile");
const Attendance = require("./Attendance");
const Assignment = require("./Assignment");
const Exam = require("./Exam");
const Notice = require("./Notice");
const Fee = require("./Fee");

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
};