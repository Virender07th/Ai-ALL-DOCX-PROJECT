import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  sendOTP,
  signUp,
  login,
  changePassword,
  resetPassword,
  forgotPassword,
} from "../Controllers/AuthController.js";
import auth from "../Middleware/auth.middlewares.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../Models/User.js";
import Profile from "../Models/Profile.js";

const router = express.Router();

// Local Auth
router.post("/send-otp", sendOTP);
router.post("/signup", signUp);
router.post("/login", login);
router.post("/change-password", auth, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// --- Google OAuth ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://ai-all-docx-project-77.onrender.com/api/v1/auth/google/callback", // ✅ backend URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id }).populate("additionalDetails");

        if (!user) {
          user = await User.create({
            userName: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            profilePicture: profile.photos?.[0]?.value,
            authProvider: "google",
            isVerified: true,
          });

          const userProfile = await Profile.create({
            userId: user._id,
            imageUrl: `https://api.dicebear.com/6.x/initials/svg?seed=${user.userName?.[0] || "U"}`,
          });

          user.additionalDetails = userProfile._id;
          await user.save();
          await user.populate("additionalDetails");
        }

        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_TOKEN_SECRET,
          { expiresIn: process.env.JWT_TOKEN_EXPIRY || "5d" }
        );

        user.lastLoginAt = new Date();
        await user.save();

        return done(null, { ...user.toObject(), token });
      } catch (err) {
        console.error("Google OAuth Error:", err);
        return done(err, null);
      }
    }
  )
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://ai-all-docx-project.vercel.app/register",
    session: false,
  }),
  (req, res) => {
    res.redirect(`https://ai-all-docx-project.vercel.app/register?token=${req.user.token}`);
  }
);

// --- Facebook OAuth ---
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: "https://ai-all-docx-project-77.onrender.com/api/v1/auth/facebook/callback", // ✅ backend URL
      profileFields: ["id", "emails", "name", "picture.type(large)"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ facebookId: profile.id }).populate("additionalDetails");

        if (!user) {
          user = await User.create({
            userName: `${profile.name?.givenName || ""} ${profile.name?.familyName || ""}`.trim(),
            email: profile.emails?.[0]?.value || `${profile.id}@facebook.com`,
            facebookId: profile.id,
            profilePicture: profile.photos?.[0]?.value || "",
            authProvider: "facebook",
            isVerified: true,
          });

          const userProfile = await Profile.create({
            userId: user._id,
            imageUrl: `https://api.dicebear.com/6.x/initials/svg?seed=${user.userName?.[0] || "U"}`,
          });

          user.additionalDetails = userProfile._id;
          await user.save();
          await user.populate("additionalDetails");
        }

        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_TOKEN_SECRET,
          { expiresIn: process.env.JWT_TOKEN_EXPIRY || "5d" }
        );

        user.lastLoginAt = new Date();
        await user.save();

        return done(null, { ...user.toObject(), token });
      } catch (err) {
        console.error("Facebook OAuth Error:", err);
        return done(err, null);
      }
    }
  )
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"], session: false })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "https://ai-all-docx-project.vercel.app/register",
    session: false,
  }),
  (req, res) => {
    res.redirect(`https://ai-all-docx-project.vercel.app/register?token=${req.user.token}`);
  }
);

export default router;
