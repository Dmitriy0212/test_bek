import { Article } from "../../models/Article.js";
import createHttpError from "http-errors";
export const getArticleById = async (req, res, next) => {
  const { id } = req.params;
  // Той самий populate, що й у списках, щоб ownerId усюди мав однакову форму
  const article = await Article.findById(id).populate("ownerId", "name avatarUrl");
  if (!article) {
    throw createHttpError(404, "Article not found");
  }

  res.status(200).json({
    article,
  });
};
