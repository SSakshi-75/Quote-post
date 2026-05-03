import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import Db from "./src/database/Db.js";
import cors from "cors";
import morgan from "morgan";
import { userRoutes } from "./src/routes/userRoutes.routes.js";
import { quoteRoutes } from "./src/routes/quoteRoutes.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config();

// Connect to Database
Db();

const app = express();

app.use(cors({

  origin: ["https://quote-post-hfrg.vercel.app", "https://quote-post-75.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
// Check if MongoDB URL is provided
if (!process.env.MONGO_DB_URL) {
  console.error("CRITICAL: MONGO_DB_URL is not defined in environment variables!");
}


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api", (req, res) => {
  res.json({ message: "QuotePost API is running (v2)..." });
});


app.use("/api/users", userRoutes);
app.use("/api/quotes", quoteRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "public")));

// API route 404 handler
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.originalUrl}` });
});

// All other routes should serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;

// Only listen locally, Vercel will handle the serverless function
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
}

export default app;
