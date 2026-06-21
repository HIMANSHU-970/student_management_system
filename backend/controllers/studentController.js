const { User, StudentProfile, Attendance, Course, Fee } = require('../models/index');

// 1. Get Profile
const getStudentProfile = async (req, res) => {
    try {
        const profile = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: [{ model: StudentProfile }]
        });
        if (!profile) return res.status(404).json({ message: "Profile not found" });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Update Profile
const updateStudentProfile = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        await User.update({ name }, { where: { id: req.user.id } });
        await StudentProfile.update({ phone, address }, { where: { userId: req.user.id } });
        res.json({ message: "Profile updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Get Attendance
const getStudentAttendance = async (req, res) => {
    try {
        const attendanceData = await Attendance.findAll({
            where: { studentId: req.user.id },
            include: [{ model: Course, attributes: ['courseName', 'courseCode'] }]
        });
        res.json(attendanceData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Get Fees
const getStudentFees = async (req, res) => {
    try {
        const fees = await Fee.findAll({ where: { studentId: req.user.id } });
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Get Courses
const getStudentCourses = async (req, res) => {
    try {
        const student = await StudentProfile.findOne({ where: { userId: req.user.id } });
        if (!student) return res.status(404).json({ message: "Student profile not found" });
        
        const courses = await Course.findAll({ where: { department: student.department } });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getStudentProfile,
    updateStudentProfile,
    getStudentAttendance,
    getStudentFees,
    getStudentCourses
};