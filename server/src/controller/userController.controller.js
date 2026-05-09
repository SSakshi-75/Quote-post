import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

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
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ message: "Server configuration error: JWT_SECRET missing" });
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
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        path: "/",
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
      path: "/",
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
    const protocol = req.get("x-forwarded-proto") || req.protocol;
    const profilePic = `${protocol}://${req.get("host")}/uploads/${req.file.filename}`;
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

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    // Send email (Mock if no SMTP configured)
    console.log(`Password Reset Link: ${resetUrl}`);

    // If SMTP is not configured, we still return success but log link
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: '"QuotePost" <no-reply@quotepost.com>',
        to: user.email,
        subject: "Password Reset Request",
        html: `<h3>Password Reset</h3>
               <p>You requested a password reset. Please click the link below to reset your password:</p>
               <a href="${resetUrl}">${resetUrl}</a>
               <p>This link will expire in 30 minutes.</p>`,
      });
    } catch (err) {
      console.warn("SMTP Email failed to send. Check EMAIL_USER/PASS in .env. Link logged to console.");
    }

    return res.status(200).json({ message: "Reset link sent to email (and logged to console)" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Set new password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
