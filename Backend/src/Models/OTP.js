import mongoose from "mongoose";
import bcrypt from "bcrypt";
import mailSender from "../Utils/mailSender.js";
 import { otpTemplate } from "../Utils/Template.js";
const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  },
});

async function sendVerificationEmail(email, otp) {
    try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      otpTemplate(otp)
    );
    console.log("Email sent:", mailResponse);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
}

OTPSchema.pre("save", async function (next) {
  console.log("New Document saved to database");
   if (this.isNew) {
    try {
      await sendVerificationEmail(this.email, this.otp);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const OTP = mongoose.model("OTP", OTPSchema);
export default OTP;