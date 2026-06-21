const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Assignment = sequelize.define('Assignment', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    courseId: { type: DataTypes.UUID, allowNull: false }, // 🆕 kis subject ki assignment hai
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    dueDate: { type: DataTypes.DATEONLY, allowNull: false },
    fileUrl: { type: DataTypes.STRING } // PDF या इमेज का पाथ स्टोर करने के लिए
});

module.exports = Assignment;