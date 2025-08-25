import Profile from "../Models/Profile.js";
import uploadImageToCloudinary from "../Utils/imageUploader.js";
import User from "../Models/User.js";

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await User.findById(userId)
      .select("-password -token -resetPasswordToken -resetPasswordExpires")
      .populate("additionalDetails");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("getUserProfile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching profile",
    });
  }
};

const updateDisplayPicture = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }
    const uploadResult = await uploadImageToCloudinary(
      req.file.path,
      process.env.FOLDER_NAME,
      300,
      "auto"
    );

    if (!uploadResult?.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image",
      });
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { $set: { imageUrl: uploadResult.secure_url } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Display picture updated",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("updateDisplayPicture error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating display picture",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bio, location, gender, contactNumber } = req.body;

    if (!bio || !location || !contactNumber || !gender) {
      return sendError(res, 400, "No data provided to update");
    }

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (contactNumber !== undefined) updateData.contactNumber = contactNumber;
    if (gender !== undefined) {
      const allowedGenders = ["Male", "Female", "Other Gender"];
      if (!allowedGenders.includes(gender)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid gender value" });
      }
      updateData.gender = gender;
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    const user = await User.findById(userId).populate("additionalDetails");

    res.status(200).json({
      success: true,
      message: "Profile updated",
      data: user,
    });
  } catch (error) {
    console.error("updateUserProfile error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error updating profile" });
  }
};

const deleteUserProfile = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user._id;

    const deletedProfile = await Profile.findOneAndDelete(
      { user: userId },
      { session }
    );

    const deletedUser = await User.findOneAndDelete(
      { _id: userId },
      { session }
    );

    if (!deletedProfile || !deletedUser) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "User or Profile not found",
      });
    }

    await session.commitTransaction();
    session.endSession();

    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "User and profile deleted successfully",
      deletedProfile,
      deletedUser,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("deleteUserProfile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting profile",
    });
  }
};

export {
  getUserProfile,
  updateDisplayPicture,
  updateUserProfile,
  deleteUserProfile,
};
