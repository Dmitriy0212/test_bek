import { Joi, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";
import { CATEGORIES } from "../constants/index.js";

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message("Invalid id format") : value;
};

export const articleIdSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
  }),
};

// Тільки пагінація: фільтрація і пошук живуть у GET /articles/filter.
// Раніше тут були category і search — вони проходили валідацію, але контролер
// їх ігнорував і віддавав 200 з усіма статтями, тобто мовчки брехав клієнту.
export const getArticlesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
  }),
};

// GET /users/:id/articles — перевіряє і :id, і пагінацію.
// Раніше роут вішав саму articleIdSchema, тому query не валідувалася взагалі:
// ?perPage=abc давало NaN у .skip()/.limit() і 500, а ?perPage=100000 — дамп усієї колекції.
export const getUserArticlesSchema = {
  ...articleIdSchema,
  ...getArticlesSchema,
};

export const getArticlesFilteredSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    category: Joi.string()
      .valid(...CATEGORIES)
      .optional(),
    search: Joi.string().trim().allow(""),
    sortBy: Joi.string().valid("createdAt", "date", "rate", "title").default("createdAt"),
    order: Joi.string().valid("asc", "desc").default("desc"),
  }),
};

// Межі 100-4000 з ТЗ стосуються тексту статті (article), а не desc:
// перевірено по сіду — desc там 0-54 символи (підзаголовок), article 469-4698.
// desc не required: форма створення за макетом його не збирає, контролер
// виводить його з тексту через buildArticleDesc.
export const createArticleSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(48).required(),
    desc: Joi.string().max(200),
    article: Joi.string().min(100).max(4000).required(),
    category: Joi.string()
      .valid(...CATEGORIES)
      .optional(),
  }),
};

export const updateArticleSchema = {
  ...articleIdSchema,
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(48),
    desc: Joi.string().max(200),
    article: Joi.string().min(100).max(4000),
    category: Joi.string().valid(...CATEGORIES),
  })
    .min(1) // важливо: не дозволяємо порожнє тіло
    .unknown(true),
};
