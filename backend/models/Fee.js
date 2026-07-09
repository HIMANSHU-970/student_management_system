const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Fee = sequelize.define('Fee', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    term: { type: DataTypes.STRING, allowNull: false }, // 🆕 e.g. "Year 1 Fee"
    amount: { type: DataTypes.FLOAT, allowNull: false },
    dueDate: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.ENUM('Paid', 'Unpaid', 'Pending'), defaultValue: 'Unpaid' },
    transactionId: { type: DataTypes.STRING }
});

module.exports = Fee;