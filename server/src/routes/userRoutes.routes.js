import express from "express";
import { User } from "../models/userModel.js";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
  getAllUsers,
  deleteUser,
} from "../controller/userController.controller.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

export const userRoutes = express.Router();
userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.delete("/logout", logoutUser);
userRoutes.patch("/update-profile", authMiddleware, upload.single("profilePic"), updateProfile);
userRoutes.get("/all", authMiddleware, isAdmin, getAllUsers);
userRoutes.delete("/delete/:id", authMiddleware, isAdmin, deleteUser);

// ✅ TEST ROUTE (middleware check)
userRoutes.get("/test", authMiddleware, async (req, res) => {
  const test = await User.findById(req.user).select("-password");
  res.json({
    message: "Middleware working ✅",
    user: test,
  });
});

// ✅ DATABASE DIAGNOSTIC ROUTE
userRoutes.get("/test-db", async (req, res) => {
  try {
    const mongoose = (await import("mongoose")).default;
    const state = mongoose.connection.readyState;
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    
    res.json({
      connectionState: states[state],
      urlConfigured: !!process.env.MONGO_DB_URL,
      maskedUrl: process.env.MONGO_DB_URL?.replace(/:([^@]+)@/, ":****@"),
      error: null
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
});
