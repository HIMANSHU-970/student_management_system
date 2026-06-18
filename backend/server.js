require("dotenv").config();

const http = require("http");
const app = require("./app");
const cors = require("cors");
const { Server } = require("socket.io");

// 🔥 IMPORT DB CONNECTION OBJECT CORRECTLY
const { sequelize } = require("./config/db");
// 🔥 IMPORT MODELS INDEX TO LOAD ALL THE ERP RELATIONSHIPS
const models = require("./models");

const PORT = process.env.PORT || 5002;

// ===============================
// 🔥 CREATE HTTP SERVER
// ===============================
const server = http.createServer(app);

// ===============================
// 🔥 SOCKET SETUP (REAL-TIME NOTIFICATIONS)
// ===============================
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("send_notification", (data) => {
    io.emit("receive_notification", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ====================================================
// 🔥 ASYNC DATABASE CONNECTION, SYNC & SERVER START
// ====================================================
const startServer = async () => {
  try {
    // 1. Authenticate PostgreSQL Database Connection
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Connected Successfully");

    // 2. Sync Models and Foreign Keys { alter: true keeps structural safety }
    await sequelize.sync({ alter: true });
    console.log("🔥 All ERP Database Tables & Relations Synced Successfully");

    // 3. Start Listening Only After Database is Fully Synced
    server.listen(PORT, () => {
      console.log(`🚀 Server running at: http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Critical Database Initialize/Sync Error:", err.message);
    process.exit(1); // सर्वर एरर होने पर सुरक्षित तरीके से बंद हो जाएगा
  }
};

// सर्वर बूटस्ट्रैप को ट्रिगर करें
startServer();