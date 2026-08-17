import createHttpError from "http-errors";
import { Article, User } from "../../models/index.js";

export const addSavedArticle = async (req, res) => {
  const { id } = req.params;

  const article = await Article.findById(id);

  if (!article) {
    throw createHttpError(404, "Article not found");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { savedArticles: id } },
    { returnDocument: "after" },
  );

  res.status(200).json({
    savedArticles: user.savedArticles,
  });
};
