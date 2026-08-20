import { Article } from "../../models/Article.js";

// Екранує спецсимволи regex у пошуковому рядку перед підстановкою в $regex —
// без цього юзер міг би передати довільний патерн (не тільки повільний, а й
// такий, що матчить більше, ніж він ввів)
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getArticlesFiltered = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      category,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;
 
    const skip = (page - 1) * perPage;
 
    const filter = {};
 
    if (category) {
      filter.category = category;
    }
 
    if (search) {
      const escapedSearch = escapeRegex(search);

      filter.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { desc: { $regex: escapedSearch, $options: "i" } },
      ];
    }
 
    // _id як вторинний ключ: інакше документи з однаковим значенням sortBy
    // (а createdAt відсутній у 200 із 201 сідової статті) шикуються довільно,
    // і сторінки пагінації починають дублювати й губити записи
    const sort = { [sortBy]: order === "asc" ? 1 : -1, _id: -1 };
 
    const articlesQuery = Article.find(filter);
 
    const [totalItems, articles] = await Promise.all([
      articlesQuery.clone().countDocuments(),
      articlesQuery
        .select("-article")
        .sort(sort)
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
  } catch (error) {
    next(error);
  }
};