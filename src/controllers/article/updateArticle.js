import createHttpError from "http-errors";
import { v2 as cloudinary } from "cloudinary";
import { Article } from "../../models/index.js";
import { saveFileToCloudinary, buildArticleDesc } from "../../utils/index.js";

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

      // Без цього стара картинка лишається сиротою в Cloudinary назавжди —
      // deleteArticle.js так само чистить зображення при видаленні статті
      if (existingArticle.img) {
        try {
          const publicId = existingArticle.img.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`articles/${publicId}`);
        } catch (cleanupError) {
          console.warn("Не вдалося видалити стару картинку статті:", cleanupError.message);
        }
      }
    }

    const updatedData = {};

    if (title !== undefined) updatedData.title = title;
    if (category !== undefined) updatedData.category = category;

    if (article !== undefined) {
      updatedData.article = article;
      // Форма редагування не має поля desc (як і форма створення), тож без
      // цього desc лишався би старим назавжди після зміни тексту статті —
      // та сама логіка, що й у createArticle.js
      updatedData.desc = desc ?? buildArticleDesc(article);
    } else if (desc !== undefined) {
      updatedData.desc = desc;
    }

    updatedData.img = imageUrl;

    const updatedArticle = await Article.findByIdAndUpdate(id, updatedData, {
      returnDocument: "after",
      runValidators: true,
    }).populate("ownerId", "name avatarUrl");

    return res.status(200).json({
      status: 200,
      message: "Article updated successfully",
      data: updatedArticle,
    });
  } catch (error) {
    next(error);
  }
};
