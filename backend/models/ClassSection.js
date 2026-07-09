const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ClassSection = sequelize.define('ClassSection', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }, // e.g. "BCA 1st Year - Section A"
    departmentId: { type: DataTypes.UUID, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    section: { type: DataTypes.STRING, allowNull: false, defaultValue: "A" },
    classTeacherId: { type: DataTypes.UUID, allowNull: true }
});

module.exports = ClassSection;