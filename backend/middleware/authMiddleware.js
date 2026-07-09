const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey123");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// 🔧 Dono export styles support karne ke liye (purane routes `const auth = require(...)` use karte hain,
// naye routes `const { protect } = require(...)` use karte hain)
module.exports = protect;
module.exports.protect = protect;