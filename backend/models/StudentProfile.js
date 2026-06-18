const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const StudentProfile = sequelize.define('StudentProfile', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    rollNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    department: { type: DataTypes.STRING, allowNull: false },
    semester: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT }
});

module.exports = StudentProfile;