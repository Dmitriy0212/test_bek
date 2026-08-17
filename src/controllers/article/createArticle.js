import createHttpError from "http-errors";
import { Article, User } from "../../models/index.js";
import { saveFileToCloudinary, buildArticleDesc } from "../../utils/index.js";

export const createArticle = async (req, res, next) => {
  const { title, desc, article, category } = req.body;
  const { file } = req;

  const date = new Date().toISOString().split("T")[0];

  if (!file) {
    throw createHttpError(400, "Article image is required");
  }

  const imageUrl = await saveFileToCloudinary(file.buffer, "articles");

  const createdArticle = await Article.create({
    title,
    desc: desc ?? buildArticleDesc(article),
    article,
    img: imageUrl,
    date,
    category,
    ownerId: req.user._id,
  });

  await User.findByIdAndUpdate(req.user._id, { $inc: { articlesAmount: 1 } });
  await createdArticle.populate("ownerId", "name avatarUrl");

  return res.status(201).json({
    status: 201,
    message: "Article created successfully",
    data: createdArticle,
  });
};
