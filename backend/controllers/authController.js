const { User, StudentProfile, TeacherProfile } = require("../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// 📝 1. USER SIGNUP (Student / Teacher / Admin)
// ==========================================
exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      rollNumber,  // कैमल-केस (हमारे Sequelize मॉडल के अनुसार)
      department,
      semester,
      employeeId,  // TeacherProfile के लिए ज़रूरी
      qualification,
      phone,
      address
    } = req.body;

    // 1. चेक करें कि ईमेल पहले से मौजूद तो नहीं है
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    // 2. नया यूजर क्रिएट करें (User.js मॉडल का hook अपने आप पासवर्ड हैश कर देगा)
    const user = await User.create({
      name,
      email,
      password, // डायरेक्ट पासवर्ड भेजें, hook इसे अपने आप सिक्योर कर देगा
      role
    });

    const userId = user.id;

    // 3. अगर रोल 'student' है, तो StudentProfile टेबल में डेटा डालें
    if (role === "student") {
      // एक रैंडम या डिफॉल्ट रोल नंबर अगर फ्रंटएंड से न आए
      const finalRoll = rollNumber || `ROLL-${Math.floor(100000 + Math.random() * 900000)}`;
      
      await StudentProfile.create({
        userId: userId,
        rollNumber: finalRoll,
        department: department || "General",
        semester: semester || 1,
        phone: phone || null,
        address: address || null
      });
    }

    // 4. अगर रोल 'teacher' है, तो TeacherProfile टेबल में डेटा डालें
    if (role === "teacher") {
      const finalEmpId = employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
      
      await TeacherProfile.create({
        userId: userId,
        employeeId: finalEmpId,
        department: department || "General",
        qualification: qualification || "B.Tech/M.Tech",
        phone: phone || null
      });
    }

    res.status(201).json({
      message: "Signup Successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

// ==========================================
// 🔐 2. USER LOGIN 
// ==========================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Sequelize के तरीके से यूजर को ढूंढें
    const foundUser = await User.findOne({ where: { email } });

    if (!foundUser) {
      return res.status(400).json({
        message: "Invalid Email"
      });
    }

    // 2. User मॉडल के comparePassword मेथड से पासवर्ड मैच करें
    const isMatch = await foundUser.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password"
      });
    }

    // 3. JWT टोकन साइन करें
    const token = jwt.sign(
      {
        id: foundUser.id,
        role: foundUser.role
      },
      process.env.JWT_SECRET || "secretkey123",
      {
        expiresIn: "7d"
      }
    );

    // 4. रिस्पॉन्स भेजें
    res.json({
      message: "Login Successful",
      token,
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      }
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};