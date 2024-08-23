const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    picture: { type: String, required: false, default: "" },
    name: { type: String, required: false, default: "Anonymous" },
    otp: { type: Number, required: false, default: null },
    isFavorite: { type: Boolean, required: false, default: false },
    isFavoriteLetters: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Letter" },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
