import createHttpError from "http-errors";
import { User } from "../../models/index.js";

export const removeSavedArticle = async (req, res) => {
  const { id } = req.params;

  const user = await User.findOneAndUpdate(
    { _id: req.user._id, savedArticles: id },
    { $pull: { savedArticles: id } },
    { returnDocument: "after" },
  );

  if (!user) {
    throw createHttpError(404, "Article not found in saved articles");
  }

  res.status(200).json({
    savedArticles: user.savedArticles,
  });
};
