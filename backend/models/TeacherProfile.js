const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TeacherProfile = sequelize.define('TeacherProfile', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    employeeId: { type: DataTypes.STRING, allowNull: false, unique: true },
    department: { type: DataTypes.STRING, allowNull: false },
    qualification: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING }
});

module.exports = TeacherProfile;