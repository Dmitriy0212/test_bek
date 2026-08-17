import createHttpError from "http-errors";
import { User } from "../../models/index.js";

import bcrypt from "bcrypt";
import { createSession, setSessionCookies } from "../../services/session.js";
import { saveFileToCloudinary } from "../../utils/index.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // collation: щоб "user@gmail.com" і "USER@gmail.com" вважались тим самим
  // email при перевірці на дублікат — інакше можна зареєструвати два
  // акаунти на одну й ту саму адресу, які різняться лише регістром.
  const existingUser = await User.findOne({ email }).collation({ locale: "en", strength: 2 });

  if (existingUser) {
    throw createHttpError(400, "Email is already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Аватар за ТЗ опційний: форма може прийти і як JSON без файлу,
  // і як multipart із полем avatar. Ліміт 1 МБ і фільтр за mimetype
  // тримає upload-мідлвара, тут лишається тільки завантажити.
  const avatarUrl = req.file ? await saveFileToCloudinary(req.file.buffer, "avatars") : null;

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    avatarUrl,
  });

  const session = await createSession(newUser._id);

  setSessionCookies(res, session);

  res.status(201).json({
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    avatarUrl: newUser.avatarUrl,
  });
};
