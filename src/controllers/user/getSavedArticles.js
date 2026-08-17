export const getSavedArticles = async (req, res) => {
  const user = await req.user.populate({
    path: "savedArticles",
    populate: { path: "ownerId", select: "name avatarUrl" },
  });

  res.status(200).json({
    savedArticles: user.savedArticles,
  });
};
