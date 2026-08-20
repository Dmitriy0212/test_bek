import createHttpError from "http-errors";
import { User } from "../../models/User.js";
import bcrypt from "bcrypt";
import { createSession, setSessionCookies } from "../../services/session.js";

export const login = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).collation({
    locale: "en",
    strength: 2,
  });

  if (!user) {
    throw createHttpError(401, "Incorrect email or password");
  }

  if (!user.password) {
    throw createHttpError(401, "Incorrect email or password");
  }

  const isValidPassword = await bcrypt.compare(req.body.password, user.password);

  if (!isValidPassword) {
    throw createHttpError(401, "Incorrect email or password");
  }

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  });
};
