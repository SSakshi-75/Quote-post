import mongoose from "mongoose";

const Db = async () => {
  try {
    if (!process.env.MONGO_DB_URL) {
      console.warn("⚠️ MONGO_DB_URL is not defined in environment variables");
      return;
    }
    console.log("⏳ Connecting to Database...");
    const conn = await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("📡 Database Connected:", conn.connection.host);
  } catch (err) {
    console.error("❌ Database Connection Error:", err.message);
  }
};

export default Db;