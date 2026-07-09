const { Message, User, TeacherSubject, StudentCourse } = require("../models/index");
const { Op } = require("sequelize");

// 🆕 Send a message
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, content } = req.body;

    if (!receiverId || !content?.trim()) {
      return res.status(400).json({ message: "receiverId and content required" });
    }

    const message = await Message.create({ senderId, receiverId, content });
    res.status(201).json({ message: "Message sent successfully", data: message });
  } catch (err) {
    console.error("❌ sendMessage Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 Get conversation with a specific user
exports.getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      },
      order: [["createdAt", "ASC"]]
    });

    // Mark messages as read
    await Message.update(
      { isRead: true },
      { where: { senderId: otherUserId, receiverId: userId, isRead: false } }
    );

    res.json(messages);
  } catch (err) {
    console.error("❌ getConversation Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 Get list of contacts (people I can message)
// Teacher: students enrolled in their subjects
// Student: teachers of their enrolled subjects
exports.getContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let contacts = [];

    if (role === "teacher") {
      const myCourses = await TeacherSubject.findAll({ where: { teacherId: userId } });
      const courseIds = myCourses.map(c => c.courseId);

      if (courseIds.length > 0) {
        const enrollments = await StudentCourse.findAll({
          where: { courseId: courseIds },
          include: [{ model: User, as: "student", attributes: ["id", "name", "email"] }]
        });
        const uniqueMap = {};
        enrollments.forEach(e => { if (e.student) uniqueMap[e.student.id] = e.student; });
        contacts = Object.values(uniqueMap);
      }
    } else if (role === "student") {
      const myEnrollments = await StudentCourse.findAll({ where: { studentId: userId } });
      const courseIds = myEnrollments.map(e => e.courseId);

      if (courseIds.length > 0) {
        const assignments = await TeacherSubject.findAll({
          where: { courseId: courseIds },
          include: [{ model: User, as: "teacher", attributes: ["id", "name", "email"] }]
        });
        const uniqueMap = {};
        assignments.forEach(a => { if (a.teacher) uniqueMap[a.teacher.id] = a.teacher; });
        contacts = Object.values(uniqueMap);
      }
    } else if (role === "admin") {
      contacts = await User.findAll({
        where: { role: { [Op.ne]: "admin" } },
        attributes: ["id", "name", "email", "role"]
      });
    }

    res.json(contacts);
  } catch (err) {
    console.error("❌ getContacts Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 Get unread message count (for badge)
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.count({ where: { receiverId: req.user.id, isRead: false } });
    res.json({ count });
  } catch (err) {
    console.error("❌ getUnreadCount Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};