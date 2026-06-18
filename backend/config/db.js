const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

// 🔥 TEST CONNECTION
sequelize.authenticate()
  .then(() => {
    console.log("✅ PostgreSQL connected successfully");
  })
  .catch((err) => {
    console.log("❌ PostgreSQL connection failed:", err);
  });

// ⚡ इसे बदलकर ऑब्जेक्ट बना दीजिए ताकि { sequelize } वाला इम्पोर्ट काम कर जाए
module.exports = { sequelize };