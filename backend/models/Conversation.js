// ******** Import Configs ******** //
const mongoose = require("mongoose");

// ******** Create Schema ******** //
const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    unreadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ******** Create Model ******** //
const Conversation = mongoose.model("Conversation", conversationSchema);

// ******** Exports ******** //
module.exports = Conversation;
