import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = req.body.email?.toLowerCase();
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All Fields are Required" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: "Password must be 8-64 chars with uppercase, lowercase, number and special char (@$!%*?&)" 
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({ message: "User Already Exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    return res.status(201).json({
      message: "Registration Successfully!!!",
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: error.message, error });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.toLowerCase();
    if (!email || !password) {
      return res.status(400).json({ message: "All Fields are Required" });
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: userExist._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login Successfully!!!",
        user: {
          id: userExist._id,
          name: userExist.name,
          email: userExist.email,
          role: userExist.role,
          profilePic: userExist.profilePic,
        },
        token,
      });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: error.message, error });
  }
};

// Logout
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({ message: "Logout Successfully!!!" });
  } catch (error) {
    return res.status(500).json({ message: "server error", error });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const profilePic = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, { profilePic }, { new: true });
    return res.status(200).json({ 
      message: "Profile Updated", 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        profilePic: user.profilePic 
      } 
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get All Users (Admin Only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Delete User (Admin Only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves (optional but safer)
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own admin account" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
