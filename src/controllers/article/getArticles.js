import { Article } from "../../models/Article.js";

export const getArticles = async (req, res, next) => {
  const { page = 1, perPage = 10 } = req.query;

  const skip = (page - 1) * perPage;

  const articlesQuery = Article.find();

  const [totalItems, articles] = await Promise.all([
    articlesQuery.clone().countDocuments(),
    articlesQuery
      // -article: картці потрібні лише заголовок, опис і картинка, а текст
      // статті в середньому 3170 символів — на 20 карток це ~64 КБ зайвого
      .select("-article")
      // _id як тайбрейкер обовʼязковий: 200 із 201 сідових статей не мають
      // createdAt, тож без нього вся ця група — одна нічия, порядок у ній
      // Mongo не гарантує, і сторінки пагінації дублюють та гублять статті
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(perPage)
      .populate("ownerId", "name avatarUrl"),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    articles,
  });
};
