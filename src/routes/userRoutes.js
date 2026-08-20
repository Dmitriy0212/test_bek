import { Router } from "express";
import { celebrate } from "celebrate";
import { user as ctrl } from "../controllers/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { articleIdSchema, getUsersSchema, getUserArticlesSchema } from "../validations/index.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { updateUserSchema } from "../validations/userValidation.js";

const userRoutes = Router();

// Отримати список користувачів (public)
userRoutes.get("/", celebrate(getUsersSchema), ctrl.getUsers);

userRoutes.get("/me", authMiddleware, ctrl.getMe);

// Отримати інфо про користувача за id (public)
userRoutes.get("/:id", ctrl.getUserInfo);

// Оновити дані користувача (private)
userRoutes.patch("/me", authMiddleware, celebrate(updateUserSchema), ctrl.updateUser);

// Додати/змінити аватар (private)
userRoutes.patch("/me/avatar", authMiddleware, upload.single("avatar"), ctrl.updateAvatar);

// Видалити аватар (private)
userRoutes.delete("/me/avatar", authMiddleware, ctrl.deleteAvatar);

// Отримати статті користувача (public)
userRoutes.get("/:id/articles", celebrate(getUserArticlesSchema), ctrl.getUserArticles);

// Отримати збережені статті (private)
userRoutes.get("/me/saved", authMiddleware, ctrl.getSavedArticles);

// Додати статтю у збережені (private)
userRoutes.post("/me/saved/:id", authMiddleware, celebrate(articleIdSchema), ctrl.addSavedArticle);

// Видалити статтю зі збережених (private)
userRoutes.delete(
  "/me/saved/:id",
  authMiddleware,
  celebrate(articleIdSchema),
  ctrl.removeSavedArticle,
);

export default userRoutes;
