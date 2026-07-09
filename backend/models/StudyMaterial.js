const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const StudyMaterial = sequelize.define('StudyMaterial', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('notes', 'pdf', 'ppt', 'video', 'other'), defaultValue: 'other' },
    fileUrl: { type: DataTypes.STRING, allowNull: false }, // /uploads/xyz.pdf
    courseId: { type: DataTypes.UUID, allowNull: false },
    uploadedById: { type: DataTypes.UUID, allowNull: false }
});

module.exports = StudyMaterial;