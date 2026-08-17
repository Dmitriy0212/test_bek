import { CATEGORIES } from "../../constants/index.js";

// Категорії фіксовані і живуть у константі, а не в базі: вони ж використовуються
// як enum у моделі Article і в Joi-схемах, тож джерело правди має бути одне.
export const getCategories = async (req, res) => {
  res.status(200).json(CATEGORIES);
};
