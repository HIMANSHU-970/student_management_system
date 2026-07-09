const express = require("express");
const router = express.Router();
const { sendMessage, getConversation, getContacts, getUnreadCount } = require("../controllers/messageController");
const auth = require("../middleware/authMiddleware");

router.post("/send", auth, sendMessage);
router.get("/conversation/:otherUserId", auth, getConversation);
router.get("/contacts", auth, getContacts);
router.get("/unread-count", auth, getUnreadCount);

module.exports = router;