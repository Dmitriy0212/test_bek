export const getSavedArticles = async (req, res) => {
  const user = await req.user.populate({
    path: "savedArticles",
    // повний текст статті тут не потрібен (та сама логіка, що в
    // getArticles/getArticlesFiltered) — картці треба лише title/desc/img
    select: "-article",
    populate: { path: "ownerId", select: "name avatarUrl" },
  });

  res.status(200).json({
    savedArticles: user.savedArticles,
  });
};
