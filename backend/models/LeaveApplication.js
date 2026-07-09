const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LeaveApplication = sequelize.define('LeaveApplication', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    studentId: { type: DataTypes.UUID, allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: false },
    fromDate: { type: DataTypes.DATEONLY, allowNull: false },
    toDate: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'), defaultValue: 'Pending' },
    reviewedById: { type: DataTypes.UUID, allowNull: true }
});

module.exports = LeaveApplication;