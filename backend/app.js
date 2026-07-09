require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5175"], // Dono ports allow karein
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROUTES
app.use("/api/auth", require("./routes/authRoutes")); // NO MIDDLEWARE HERE
app.use("/api/student", require("./routes/studentRoutes")); 
app.use("/api/teacher", require("./routes/teacherRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

app.use("/api/messages", require("./routes/messageRoutes"));

app.get("/", (req, res) => res.send("🚀 Campus Quantum API Running"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

module.exports = app;