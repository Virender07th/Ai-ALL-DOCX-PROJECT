import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      set: (v) => v?.charAt(0).toUpperCase() + v?.slice(1),
    },
    email: {
      type: String,
      required: function () {
        return this.authProvider === "local"; // Only required for local users
      },
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local"; // password only for local
      },
    },
    token: { type: String, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
    },

    // 🌍 OAuth fields
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    profilePicture: { type: String },
    authProvider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default mongoose.model("User", userSchema);
