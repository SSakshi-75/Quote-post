import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true,trim:true },
    email: { type: String, required: true, unique: true, lowercase: true,trim:true,match: [/^\S+@\S+\.\S+$/, "Please use a valid email"]},
    password: { type: String, required: true, minlength: 8, maxlength: 64 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profilePic: { type: String, default: "" },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);
export const User = mongoose.model("User", userSchema);
