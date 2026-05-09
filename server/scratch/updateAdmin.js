import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { User } from "../src/models/userModel.js";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from one level up
config({ path: path.join(__dirname, "../.env") });

const newEmail = "admin@gmail.com";
const newPassword = "Admin@123";

async function updateAdmin() {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Connected.");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Try to find by role first
    let admin = await User.findOne({ role: "admin" });

    if (!admin) {
      // Try to find by old email
      admin = await User.findOne({ email: "rani.manager@gmail.com" });
    }

    if (admin) {
      console.log(`Updating existing admin: ${admin.email}`);
      admin.email = newEmail;
      admin.password = hashedPassword;
      admin.role = "admin"; // Ensure role is admin
      await admin.save();
      console.log("Admin updated successfully!");
    } else {
      console.log("No admin found. Creating new admin user...");
      await User.create({
        name: "Admin",
        email: newEmail,
        password: hashedPassword,
        role: "admin"
      });
      console.log("New Admin created successfully!");
    }

    console.log(`New Credentials:`);
    console.log(`Email: ${newEmail}`);
    console.log(`Password: ${newPassword}`);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

updateAdmin();
