import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    title: { type: String, required: true },
    isFavorite: { type: Boolean, required: false, default: false },
    viewedId: { type: String, required: false },
  },
  { timestamps: true }
);

const Letter = mongoose.model("Letter", schema);

export default Letter;
