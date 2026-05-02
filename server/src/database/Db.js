import mongoose from "mongoose";

const Db = async () => {
  try {
    if (!process.env.MONGO_DB_URL) {
      console.warn("⚠️ MONGO_DB_URL is not defined in environment variables");
      return;
    }
    const maskedUrl = process.env.MONGO_DB_URL.replace(/:([^@]+)@/, ":****@");
    console.log("⏳ Connecting to Database with URL:", maskedUrl);
    
    if (mongoose.connection.readyState >= 1) return;

    const conn = await mongoose.connect(process.env.MONGO_DB_URL, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log("📡 Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ DB Error:", err.message);
  }
};

export default Db;