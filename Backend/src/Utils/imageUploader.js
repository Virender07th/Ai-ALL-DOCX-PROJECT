import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadImageToCloudinary = async (filePath, folder, height, quality) => {
  const options = { folder, resource_type: "auto" };

  if (height) {
    options.height = height;
    options.crop = "scale";
  }
  if (quality) {
    options.quality = quality;
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, options);

    fs.unlinkSync(filePath);

    return result;
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

export default uploadImageToCloudinary;
