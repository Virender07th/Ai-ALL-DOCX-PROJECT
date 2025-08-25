import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadImageToCloudinary = async (filePath, folder, height, quality) => {
  const options = { folder, resource_type: "auto" };

  if (height) {
    options.height = height;
    options.crop = "scale"; // ensures proper resize
  }
  if (quality) {
    options.quality = quality;
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, options);

    // Remove the file from local uploads after successful upload
    fs.unlinkSync(filePath);

    return result;
  } catch (error) {
    // Clean up file if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

export default uploadImageToCloudinary;
