import express from "express";
import { config } from "dotenv";
import compression from "compression";
import cookieParser from "cookie-parser";
import Db from "./src/database/Db.js";
import cors from "cors";
import morgan from "morgan";
import cluster from "cluster";
import os from "os";
import { userRoutes } from "./src/routes/userRoutes.routes.js";
import { quoteRoutes } from "./src/routes/quoteRoutes.routes.js";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

const PORT = process.env.PORT || 5000;
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log("Master process running:", process.pid);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log("Worker died:", worker.process.pid);
    cluster.fork();
  });
} else {
  const app = express();

  app.use(cors({ 
    origin: process.env.FRONTEND_URL || "http://localhost:5173", 
    credentials: true 
  }));

  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan("dev"));
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  app.get("/", (req, res) => {
    res.send("QuotePost API is running...");
  });

  app.use("/api/users", userRoutes);
  app.use("/api/quotes", quoteRoutes);

  Db().then(() => {
    app.listen(PORT, () =>
      console.log("🚀 Server running at http://localhost:" + PORT),
    );
  });
}
