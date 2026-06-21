const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TeacherSubject = sequelize.define('TeacherSubject', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    teacherId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    courseId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['teacherId', 'courseId'] // ek teacher ko same subject dobara assign na ho
        }
    ]
});

module.exports = TeacherSubject;