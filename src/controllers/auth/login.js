import createHttpError from "http-errors";
import { User } from "../../models/User.js";
import bcrypt from "bcrypt";
import { Session } from "../../models/Session.js";
import { createSession, setSessionCookies } from "../../services/session.js";

export const login = async (req, res, next) => {
  // collation: у базі є акаунти, зареєстровані до нормалізації регістру
  // (напр. "USER@gmail.com"). Без неї Joi вже приводить вхід до нижнього
  // регістру, але точний запит все одно не знайде документ зі старим
  // регістром у полі — саме так виникала хибна "Invalid credentials".
  const user = await User.findOne({ email: req.body.email }).collation({
    locale: "en",
    strength: 2,
  });
  if (!user) {
    throw createHttpError(401, "Invalid credentials");
  }
  if (!user.password) {
    throw createHttpError(401, "Invalid credentials");
  }
  const isValidPassword = await bcrypt.compare(req.body.password, user.password);

  if (!isValidPassword) {
    throw createHttpError(401, "Invalid credentials");
  }

  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  });
};
