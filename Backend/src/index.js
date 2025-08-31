import "./Utils/dotenv.js";
import express from "express";
import connectDataBase from "./Config/database.js";
import cloudinaryConnect from "./Config/cloudinary.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";

const app = express();

// connect db + cloudinary
connectDataBase();
cloudinaryConnect();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- CORS CONFIG ---
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://ai-all-docx-project.vercel.app" // Vercel frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman / curl

      // allow if origin matches one of allowedOrigins (ignores trailing slash / subpaths)
      if (allowedOrigins.some((o) => origin.startsWith(o))) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed: " + origin));
    },
    credentials: true,
  })
);

// handle preflight (important for credentials:true)
app.options("*", cors());

// passport init
app.use(passport.initialize());

// routes
import userRoutes from "./Routes/AuthRoutes.js";
import aiRoutes from "./Routes/AIRoutes.js";
import profileRoutes from "./Routes/ProfileRoutes.js";

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/profile", profileRoutes);

// test route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

// port fix
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 App is running at http://localhost:${PORT}`);
});
