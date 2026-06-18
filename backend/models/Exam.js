const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Exam = sequelize.define('Exam', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    examName: { type: DataTypes.STRING, allowNull: false }, 
    marksObtained: { type: DataTypes.FLOAT, allowNull: false },
    maxMarks: { type: DataTypes.FLOAT, defaultValue: 100 }
});

module.exports = Exam;