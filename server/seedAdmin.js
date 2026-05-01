import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./src/models/userModel.js";
import { config } from "dotenv";

config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL || "mongodb://localhost:27017/quote-post");
    
    const adminEmail = "admin@quotepost.com";
    const adminPassword = "Admin@123"; // Strong password

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
    });

    console.log("------------------------------");
    console.log("✅ Admin Created Successfully!");
    console.log("Email: " + adminEmail);
    console.log("Password: " + adminPassword);
    console.log("------------------------------");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
