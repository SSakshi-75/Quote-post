import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js";
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
      return res.status(401).json({ message: "unauthorized access" });
    }
    const searchUser = await User.findById(verify.id).select("-password");
    if (!searchUser) {
      return res.status(400).json({ message: "Invalid token" });
    }
    req.user = searchUser;
    next();
  } catch (error) {
    return res.status(500).json({ message: "server error", error });
  }
};export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
};
