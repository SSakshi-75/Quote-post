
    import mongoose from "mongoose";

    const Db = async () => {
      try {
        if (!process.env.MONGO_DB_URL) {
          throw new Error("MONGO_DB_URL is not defined in environment variables");
        }
        console.log("⏳ Connecting to Database...");
        const conn = await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("📡 Database Connected:", conn.connection.host);
      } catch (err) {
        console.error("❌ Database Connection Error:", err.message);
        // Don't exit process in Vercel, let it try to handle the request if possible
        // or let Vercel handle the function failure
      }
    };

    export default Db;
    