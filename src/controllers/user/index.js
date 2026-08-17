import { getUserInfo } from "./getUserInfo.js";
import { updateUser } from "./updateUser.js";
import { updateAvatar } from "./updateAvatar.js";
import { getUserArticles } from "./getUserArticles.js";
import { getSavedArticles } from "./getSavedArticles.js";
import { addSavedArticle } from "./addSavedArticle.js";
import { removeSavedArticle } from "./removeSavedArticle.js";
import { getUsers } from "./getUsers.js";
import { getMe } from "./getMe.js";

export const user = {
  getUserInfo,
  getUsers,
  updateUser,
  updateAvatar,
  getUserArticles,
  getSavedArticles,
  addSavedArticle,
  removeSavedArticle,
  getMe,
};
