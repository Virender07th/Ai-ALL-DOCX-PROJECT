import OTP from "../Models/OTP.js";
import User from "../Models/User.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import mailSender from "../Utils/mailSender.js";
import jwt from "jsonwebtoken";
import Profile from "../Models/Profile.js";
import crypto from "crypto"
 import {  changePasswordTemplate, resetPasswordSuccessTemplate, forgotPasswordTemplate } from "../Utils/Template.js";



const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_TOKEN_SECRET,
    { expiresIn: process.env.JWT_TOKEN_EXPIRY || "5d" }
  );
};

const buildSafeUser = (user) => ({
  id: user._id,
  userName: user.userName,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  authProvider: user.authProvider,
  profilePicture: user.profilePicture,
  additionalDetails: user.additionalDetails,
});

const signUp = async (req, res) => {
  try {
    const { userName, email, password, confirmPassword, otp } = req.body;

    if (!userName || !email || !password || !confirmPassword || !otp) {
      return res.status(403).json({ success: false, message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists." });
    }

    const latestOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!latestOTP || latestOTP.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    const isExpired = new Date(latestOTP.createdAt).getTime() + 5 * 60 * 1000 < Date.now();
    if (isExpired) {
      return res.status(400).json({ success: false, message: "OTP has expired." });
    }

    const user = await User.create({
      userName,
      email,
      password,
      isVerified: true,
      authProvider: "local",
    });

    const profile = await Profile.create({
      userId: user._id,
      imageUrl: `https://api.dicebear.com/6.x/initials/svg?seed=${user.userName[0]}`,
    });

    user.additionalDetails = profile._id;
    await user.save();
    await OTP.deleteMany({ email });

    return res.status(200).json({
      success: true,
      message: "User registered successfully.",
      safeUser: buildSafeUser(user),
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ success: false, message: "Signup failed." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = generateToken(user);
    user.token = token;
    user.lastLoginAt = new Date();
    await user.save();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      safeUser: buildSafeUser(user),
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Login failed." });
  }
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `User is already registered`,
      });
    }
    
    let otp, result;
    do {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    } while (result);

    await OTP.create({ email, otp });
    console.log("Generated OTP:", otp);

    return res.status(200).json({
      success: true,
      otp:otp,
      message: "OTP sent successfully to your email",
    });

  } catch (error) {
    console.error("Send OTP Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ 
      success: true, 
      message: "Logout successfully" 
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Logout Failed. \nPlease Try Again",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id);
    const { password, newPassword, confirmPassword } = req.body;

    if (!password || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, userDetails.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    userDetails.password = newPassword;
    await userDetails.save(); 


    try {
      const emailResponse = await mailSender(
        userDetails.email,
        "Your Password Has Been Updated",
        changePasswordTemplate(userDetails.userName)
      );
      console.log("Email sent successfully:", emailResponse);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res.status(500).json({
        success: false,
        message: "Password updated, but failed to send confirmation email.",
        error: emailError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the password.",
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; 

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await mailSender(
      user.email,
      "Password Reset",
      forgotPasswordTemplate(user.email , resetUrl)
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, resetPasswordToken } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.password =password;

    await user.save();
    await mailSender(
      user.email,
      "Password Reset",
      resetPasswordSuccessTemplate(user.email )
    );


    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({
      success: false,
      message: "Server error resetting password",
    });
  }
};

export {
  sendOTP,
  signUp,
  login,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
};
