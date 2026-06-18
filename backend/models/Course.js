const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Course = sequelize.define('Course', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    courseCode: { type: DataTypes.STRING, allowNull: false, unique: true },
    courseName: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: false },
    credits: { type: DataTypes.INTEGER, defaultValue: 3 }
});

module.exports = Course;