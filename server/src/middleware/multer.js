import multer from "multer";
import path from "path";
import fs from "fs";

// Determine destination (Vercel has read-only filesystem except for /tmp)
const destination = process.env.VERCEL ? "/tmp" : "uploads/";

// Ensure the local uploads directory exists in development
// Vercel environment has process.env.VERCEL set to "1"
if (!process.env.VERCEL && !fs.existsSync("uploads/")) {
  try {
    fs.mkdirSync("uploads/");
  } catch (err) {
    console.warn("Could not create uploads directory:", err.message);
  }
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
