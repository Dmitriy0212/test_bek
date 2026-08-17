import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";
import { User } from "../../models/index.js";

export const getUserInfo = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw createHttpError(400, "Invalid user id");
  }

  const user = await User.findById(id).select("name avatarUrl articlesAmount");

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  res.status(200).json(user);
};
