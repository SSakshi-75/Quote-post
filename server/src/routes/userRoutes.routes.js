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
