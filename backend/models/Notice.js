const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notice = sequelize.define('Notice', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    targetRole: { type: DataTypes.ENUM('all', 'student', 'teacher'), defaultValue: 'all' }
});

module.exports = Notice;