import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import { Session } from "../../models/index.js";
import {
  createSession,
  setSessionCookies,
} from "../../services/session.js";

export const refresh = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    throw createHttpError(401, "Session not found");
  }

  // Побиті cookie мають давати 401, з якого фронт іде в логін, а не 500
  if (!isValidObjectId(sessionId)) {
    throw createHttpError(401, "Session not found");
  }

  // findOneAndDelete перевіряє й видаляє сесію одним атомарним запитом —
  // без цього два паралельні /refresh (React StrictMode, паралельні
  // 401-retry) обидва встигають пройти findById до видалення і обидва
  // створюють нову сесію
  const session = await Session.findOneAndDelete({ _id: sessionId, refreshToken });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, "Refresh token expired");
  }

  const userId = session.userId;

  const newSession = await createSession(userId);

  setSessionCookies(res, newSession);

  // accessToken живе лише в httpOnly cookie — дублювати його в тілі
  // відповіді зводить нанівець захист httpOnly від XSS
  res.status(200).json({
    status: 200,
    message: "Successfully refreshed a session!",
  });
};