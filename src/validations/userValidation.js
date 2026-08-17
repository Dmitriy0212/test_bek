import { Joi, Segments } from "celebrate";
import { emailSchema } from "./emailSchema.js";

export const updateUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(32),
    email: emailSchema(),
  }).min(1), // важливо: не дозволяємо порожнє тіло
};

export const getUsersSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(20),
    // articlesAmount — для Top Creators: без сортування на сервері фронт
    // міг би відсортувати лише сторінку, яку отримав, і загубити реальних
    // лідерів, що не потрапили в перші N за замовчуванням (createdAt)
    sortBy: Joi.string().valid("createdAt", "articlesAmount").default("createdAt"),
    order: Joi.string().valid("asc", "desc").default("desc"),
  }),
};
