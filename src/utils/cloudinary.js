import { v2 as cloudinary } from 'cloudinary';
import { getEnvVar } from './getEnvVar.js';

cloudinary.config({
  cloud_name: getEnvVar("CLOUDINARY_NAME"),
  api_key: getEnvVar("CLOUDINARY_KEY"),
  api_secret: getEnvVar("CLOUDINARY_SECRET"),
});

export const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'contacts',
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};