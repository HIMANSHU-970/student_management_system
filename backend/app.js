require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

/* =========================================
   🔥 SECURITY & MIDDLEWARES
========================================= */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* =========================================
   🔥 ROUTES IMPORT & USE
========================================= */
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes"); // Ensure ye file exist karti hai
const adminRoutes = require("./routes/adminRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes); // Teacher API Endpoint
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);

/* =========================================
   🔥 SERVER UTILS
========================================= */
app.get("/", (req, res) => res.send("🚀 Campus Quantum API Running"));

app.use((req, res) => res.status(404).json({ success: false, message: "Route Not Found" }));

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

module.exports = app;