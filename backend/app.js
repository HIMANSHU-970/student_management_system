require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/auth", require("./routes/authRoutes")); // NO MIDDLEWARE HERE
app.use("/api/student", require("./routes/studentRoutes")); 
app.use("/api/teacher", require("./routes/teacherRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

app.get("/", (req, res) => res.send("🚀 Campus Quantum API Running"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

module.exports = app;