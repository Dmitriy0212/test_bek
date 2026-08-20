import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Немає дефолтного folder — усі виклики завжди передають свій ("articles",
// "avatars") явно, тож дефолт "harmoniq" ніколи не використовувався і лише
// вводив в оману щодо реальної структури папок у Cloudinary
export const saveFileToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result.secure_url);
    });

    uploadStream.end(fileBuffer);
  });
};
