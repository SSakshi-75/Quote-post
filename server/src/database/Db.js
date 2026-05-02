import mongoose from "mongoose";

const Db = async () => {
  try {
    if (!process.env.MONGO_DB_URL) {
      console.warn("⚠️ MONGO_DB_URL is not defined in environment variables");
      return;
    }
    const maskedUrl = process.env.MONGO_DB_URL.replace(/:([^@]+)@/, ":****@");
    console.log("⏳ Connecting to Database with URL:", maskedUrl);
    
    const conn = await mongoose.connect(process.env.MONGO_DB_URL, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log("📡 Database Connected Successfully!");
  } catch (err) {
    console.error("❌ Database Connection Error Details:", err);
    // Don't exit, just let it fail so we can see the logs
  }
};

export default Db;