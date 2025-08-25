import "./Utils/dotenv.js"
import express from "express";
import connectDataBase from "./Config/database.js";
import cloudinaryConnect from "./Config/cloudinary.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport"; // ✅ add passport

// Dotenv


// Initialize app
const app = express();

// DataBase
connectDataBase();
// Cloudinary
cloudinaryConnect();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,
  })
);

// ✅ passport initialization
app.use(passport.initialize());

//routes
import userRoutes from "./Routes/AuthRoutes.js";
import aiRoutes from "./Routes/AIRoutes.js";
import profileRoutes from "./Routes/ProfileRoutes.js";

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/profile", profileRoutes);

//def route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

// Ports
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
