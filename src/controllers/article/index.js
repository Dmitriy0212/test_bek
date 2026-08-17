import { getArticles } from "./getArticles.js";
import { getArticleById } from "./getArticleById.js";
import { createArticle } from "./createArticle.js";
import { updateArticle } from "./updateArticle.js";
import { deleteArticle } from "./deleteArticle.js";
import { getArticlesFiltered } from "./getArticlesFiltered.js";

export const article = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesFiltered,
};
