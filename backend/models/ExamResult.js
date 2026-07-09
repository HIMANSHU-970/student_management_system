const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ExamResult = sequelize.define('ExamResult', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    examId: { type: DataTypes.UUID, allowNull: false },
    studentId: { type: DataTypes.UUID, allowNull: false },
    marksObtained: { type: DataTypes.FLOAT, allowNull: false },
    published: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    indexes: [{ unique: true, fields: ['examId', 'studentId'] }]
});

module.exports = ExamResult;