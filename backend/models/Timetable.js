const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Timetable = sequelize.define('Timetable', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    day: { type: DataTypes.STRING, allowNull: false }, // e.g. "Monday"
    time: { type: DataTypes.STRING, allowNull: false }, // e.g. "10:00 AM - 11:00 AM"
    courseId: { type: DataTypes.UUID, allowNull: false },
    teacherId: { type: DataTypes.UUID, allowNull: false }
});

module.exports = Timetable;