import { config } from "dotenv";
config();
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import Db from "./src/database/Db.js";
import cors from "cors";
import morgan from "morgan";
import { userRoutes } from "./src/routes/userRoutes.routes.js";
import { quoteRoutes } from "./src/routes/quoteRoutes.routes.js";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ 
  origin: process.env.FRONTEND_URL || true, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "QuotePost API is running..." });
});

app.use("/api/users", userRoutes);
app.use("/api/quotes", quoteRoutes);

// Database connection
Db();

const PORT = process.env.PORT || 5000;

// Only listen locally, Vercel will handle the serverless function
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
}

export default app;
