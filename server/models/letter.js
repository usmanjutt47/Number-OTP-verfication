const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    title: { type: String, required: false },
    viewedId: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = Letter = mongoose.model("Letter", schema);
