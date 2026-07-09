const { User, StudentProfile, Attendance, Course, Fee, StudentCourse, Notice, Timetable, StudyMaterial, Exam, ExamResult, LeaveApplication } = require('../models/index');

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

// 3. Get Attendance (OLD - daily log style, ab use nahi ho raha frontend mein but rakha hai)
const getStudentAttendance = async (req, res) => {
    try {
        const attendanceData = await Attendance.findAll({
            where: { studentId: req.user.id },
            include: [{ model: Course, as: "course", attributes: ['courseName', 'courseCode'] }]
        });
        res.json(attendanceData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🆕 3b. Get Attendance Overview (present/total per subject - jo frontend actually use karega)
const getStudentAttendanceOverview = async (req, res) => {
    try {
        const records = await StudentCourse.findAll({
            where: { studentId: req.user.id },
            include: [{ model: Course, as: "course", attributes: ["id", "courseCode", "courseName"] }]
        });
        res.json(records);
    } catch (error) {
        console.error("❌ getStudentAttendanceOverview Error:", error);
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

// 5. Get Courses (OLD - department based fuzzy match, ab enrollment-based use karenge)
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

// 🆕 Get Notices (sirf student/all wale)
const getStudentNotices = async (req, res) => {
    try {
        const notices = await Notice.findAll({
            where: { targetRole: ["all", "student"] },
            order: [["createdAt", "DESC"]]
        });
        res.json(notices);
    } catch (error) {
        console.error("❌ getStudentNotices Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// 🆕 Get Timetable (apne enrolled subjects ki)
const getStudentTimetable = async (req, res) => {
    try {
        const enrollments = await StudentCourse.findAll({ where: { studentId: req.user.id } });
        const courseIds = enrollments.map(e => e.courseId);

        if (courseIds.length === 0) return res.json([]);

        const slots = await Timetable.findAll({
            where: { courseId: courseIds },
            include: [
                { model: Course, as: "course", attributes: ["id", "courseCode", "courseName"] },
                { model: User, as: "teacher", attributes: ["id", "name"] }
            ],
            order: [["day", "ASC"], ["time", "ASC"]]
        });
        res.json(slots);
    } catch (error) {
        console.error("❌ getStudentTimetable Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// 🆕 Get Study Materials (apne enrolled subjects ki)
const getStudentMaterials = async (req, res) => {
    try {
        const enrollments = await StudentCourse.findAll({ where: { studentId: req.user.id } });
        const courseIds = enrollments.map(e => e.courseId);

        if (courseIds.length === 0) return res.json([]);

        const materials = await StudyMaterial.findAll({
            where: { courseId: courseIds },
            include: [{ model: Course, as: "course", attributes: ["courseCode", "courseName"] }],
            order: [["createdAt", "DESC"]]
        });
        res.json(materials);
    } catch (error) {
        console.error("❌ getStudentMaterials Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// 🆕 Get Upcoming/All Exams (apne enrolled subjects ki)
const getStudentExams = async (req, res) => {
    try {
        const enrollments = await StudentCourse.findAll({ where: { studentId: req.user.id } });
        const courseIds = enrollments.map(e => e.courseId);

        if (courseIds.length === 0) return res.json([]);

        const exams = await Exam.findAll({
            where: { courseId: courseIds },
            include: [{ model: Course, as: "course", attributes: ["courseCode", "courseName"] }],
            order: [["examDate", "ASC"]]
        });
        res.json(exams);
    } catch (error) {
        console.error("❌ getStudentExams Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// 🆕 Get My Results (sirf published wale)
const getStudentResults = async (req, res) => {
    try {
        const results = await ExamResult.findAll({
            where: { studentId: req.user.id, published: true },
            include: [{ model: Exam, as: "exam", include: [{ model: Course, as: "course", attributes: ["courseCode", "courseName"] }] }]
        });
        res.json(results);
    } catch (error) {
        console.error("❌ getStudentResults Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// 🆕 Apply for Leave
const applyLeave = async (req, res) => {
    try {
        const { reason, fromDate, toDate } = req.body;
        if (!reason || !fromDate || !toDate) {
            return res.status(400).json({ message: "reason, fromDate, toDate required" });
        }

        const leave = await LeaveApplication.create({
            studentId: req.user.id, reason, fromDate, toDate
        });

        res.status(201).json({ message: "Leave application submitted successfully", leave });
    } catch (error) {
        console.error("❌ applyLeave Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// 🆕 Get My Leave Applications
const getMyLeaves = async (req, res) => {
    try {
        const leaves = await LeaveApplication.findAll({
            where: { studentId: req.user.id },
            order: [["createdAt", "DESC"]]
        });
        res.json(leaves);
    } catch (error) {
        console.error("❌ getMyLeaves Error:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStudentProfile,
    updateStudentProfile,
    getStudentAttendance,
    getStudentAttendanceOverview,
    getStudentFees,
    getStudentCourses,
    getStudentNotices,
    getStudentTimetable,
    getStudentMaterials,
    getStudentExams, 
    getStudentResults,
    applyLeave,
    getMyLeaves
};