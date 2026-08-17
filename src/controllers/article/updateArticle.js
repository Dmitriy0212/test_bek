import createHttpError from "http-errors";
import { Article } from "../../models/index.js";
import { saveFileToCloudinary } from "../../utils/index.js";

export const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, desc, article, category } = req.body;
    const { file } = req;

    const existingArticle = await Article.findById(id);

    if (!existingArticle) {
      throw createHttpError(404, "Article not found");
    }

    if (existingArticle.ownerId.toString() !== req.user._id.toString()) {
      throw createHttpError(403, "Access denied");
    }

    let imageUrl = existingArticle.img;

    if (file) {
      imageUrl = await saveFileToCloudinary(file.buffer, "articles");
    }

    const updatedData = {};

    if (title !== undefined) updatedData.title = title;
    if (desc !== undefined) updatedData.desc = desc;
    if (article !== undefined) updatedData.article = article;
    if (category !== undefined) updatedData.category = category;

    updatedData.img = imageUrl;

    const updatedArticle = await Article.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      status: 200,
      message: "Article updated successfully",
      data: updatedArticle,
    });
  } catch (error) {
    next(error);
  }
};
