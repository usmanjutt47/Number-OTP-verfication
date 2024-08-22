const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    letterId: { type: mongoose.Schema.Types.ObjectId, ref: "Letter" },
    content: { type: String, required: true },
    isRead: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

module.exports = Reply = mongoose.model("Reply", schema);
