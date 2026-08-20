import createHttpError from "http-errors";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../../models/User.js";

export const deleteAvatar = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const oldAvatarUrl = req.user.avatarUrl;

    if (!oldAvatarUrl) {
      return res.status(200).json({
        status: "success",
        message: "Аватар вже відсутній",
        data: {
          avatarUrl: "",
        },
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatarUrl: "" },
      { returnDocument: "after" },
    );

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    try {
      const publicId = oldAvatarUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`avatars/${publicId}`);
    } catch (cleanupError) {
      console.warn("Не вдалося видалити старий аватар:", cleanupError.message);
    }

    res.status(200).json({
      status: "success",
      message: "Фото успішно видалено",
      data: {
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};
