import { Article } from "../../models/index.js";

export const getUserArticles = async (req, res, next) => {
  const { id } = req.params;
  const { page = 1, perPage = 10 } = req.query;

  const skip = (Number(page) - 1) * Number(perPage);

  const [articles, totalArticles] = await Promise.all([
    Article.find({ ownerId: id })
      // те саме, що й у решті списків: картці текст статті не потрібен
      .select("-article")
      .skip(skip)
      .limit(Number(perPage))
      .sort({ createdAt: -1, _id: -1 }),
    Article.countDocuments({ ownerId: id }),
  ]);

  const totalPages = Math.ceil(totalArticles / Number(perPage));

  res.status(200).json({
    status: 200,
    message: "Successfully found user's articles!",
    data: {
      articles,
      page: Number(page),
      perPage: Number(perPage),
      totalArticles,
      totalPages,
      hasNextPage: Number(page) < totalPages,
      hasPreviousPage: Number(page) > 1,
    },
  });
};
