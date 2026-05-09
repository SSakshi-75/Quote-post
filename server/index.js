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

// Server logic restarted

// Connect to Database
Db();

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5001",
      "http://127.0.0.1:5001",
      "https://quote-post.vercel.app",
    ];
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".render.com") || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));



app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
// Database connection middleware
app.use(async (req, res, next) => {
  try {
    await Db();
    next();
  } catch (error) {
    console.error("DB Middleware Error:", error);
    res.status(500).json({ message: "Database connection failed", error: error.message });
  }
});

const uploadsPath = process.env.VERCEL ? "/tmp" : path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

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

// Only listen if not on Vercel (Vercel uses serverless functions)
if (!process.env.VERCEL) {
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
}

export default app;
