import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    picture: { type: String, required: false, default: "" },
    name: { type: String, required: false, default: "Anonymous" },
    otp: { type: Number, required: false, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", schema);

export default User;
