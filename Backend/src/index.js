import "./Utils/dotenv.js";
import express from "express";
import connectDataBase from "./Config/database.js";
import cloudinaryConnect from "./Config/cloudinary.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";

const app = express();

connectDataBase();

cloudinaryConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://ai-all-docx-project.vercel.app" // Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);


app.use(passport.initialize());

import userRoutes from "./Routes/AuthRoutes.js";
import aiRoutes from "./Routes/AIRoutes.js";
import profileRoutes from "./Routes/ProfileRoutes.js";

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/profile", profileRoutes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
