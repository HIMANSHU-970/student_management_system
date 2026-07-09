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
    origin: ["http://localhost:5173", "http://localhost:5175"], // Yahan bhi update karein
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

  // 🆕 Real-time chat messages
  socket.on("send_message", (data) => {
    // data = { senderId, receiverId, content, createdAt }
    io.to(data.receiverId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ====================================================
// 🔥 ASYNC DATABASE CONNECTION, SYNC & SERVER START
// ====================================================
// ... upar ka code waisa hi rahe

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Connected Successfully");

    await sequelize.sync({ alter: true });
    console.log("🔥 All ERP Database Tables & Relations Synced Successfully");

    // Port busy error handling
    server.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Killing process...`);
        process.exit(1); 
      }
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server running at: http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Critical Error:", err.message);
    process.exit(1); 
  }
};

startServer();