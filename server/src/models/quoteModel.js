import mongoose from "mongoose";
const quoteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    author: { type: String, default: "unknown" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required:false,
      ref: "User",
    },
    likes:[{ type: mongoose.Schema.Types.ObjectId,ref:"User" }],
    tags: [{ type: String }],
  },
  { timestamps: true },
);
export const Quote = mongoose.model("Quote", quoteSchema);
