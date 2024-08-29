const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    letterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Letter",
      required: true,
    },
    reciverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    letterSenderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isRead: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

module.exports = Reply = mongoose.model("Reply", schema);
