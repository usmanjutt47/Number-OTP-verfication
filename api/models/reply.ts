import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    letterId: { type: mongoose.Schema.Types.ObjectId, ref: "Letter" },
    content: { type: String, required: true },
    isRead: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

const Reply = mongoose.model("Reply", schema);

export default Reply;
