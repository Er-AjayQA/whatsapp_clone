// ******** Import Configs ******** //
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");
const { multerMiddleware } = require("../config/cloudinaryConfig");

// ******** Protected Routes ******** //
router.post(
  "/send-message",
  authMiddleware,
  multerMiddleware,
  chatController.sendMessage
);
router.get("/conversations", authMiddleware, chatController.getConversations);
router.get(
  "/conversations/:conversationId/messages",
  authMiddleware,
  chatController.getMessages
);
router.put("/messages/read", authMiddleware, chatController.markAsRead);
router.put(
  "/messages/:messageId",
  authMiddleware,
  chatController.deleteMessages
);

// ******** Exports ******** //
module.exports = router;
