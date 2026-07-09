const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const StudentCourse = sequelize.define('StudentCourse', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    studentId: { type: DataTypes.UUID, allowNull: false },
    courseId: { type: DataTypes.UUID, allowNull: false },
    present: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    total: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, {
    indexes: [
        { unique: true, fields: ['studentId', 'courseId'] } 
    ]
});

module.exports = StudentCourse;