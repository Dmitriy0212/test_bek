import createHttpError from "http-errors";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../../models/index.js";
import { saveFileToCloudinary } from "../../utils/saveFileToCloudinary.js";

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(400, "Будь ласка, виберіть фото");
    }

    const oldAvatarUrl = req.user.avatarUrl;

    const avatarUrl = await saveFileToCloudinary(req.file.buffer, "avatars");

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl: avatarUrl },
      { returnDocument: "after" },
    );

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    if (oldAvatarUrl) {
      try {
        const publicId = oldAvatarUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`avatars/${publicId}`);
      } catch (cleanupError) {
        console.warn("Не вдалося видалити старий аватар:", cleanupError.message);
      }
    }

    res.status(200).json({
      status: "success",
      message: "Фото успішно завантажено",
      data: {
        avatarUrl: avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};
