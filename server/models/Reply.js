const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  letterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Letter",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Reply = mongoose.model("Reply", replySchema);

module.exports = Reply;
