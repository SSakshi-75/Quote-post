import mongoose from "mongoose";

const Db = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(process.env.MONGO_DB_URL, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log("📡 Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ DB Connection Error");
  }
};

export default Db;