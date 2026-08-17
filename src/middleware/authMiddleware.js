import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import { Session, User } from "../models/index.js";

export const authMiddleware = async (req, res, next) => {
  const { sessionId, accessToken } = req.cookies;

  if (!sessionId || !accessToken) {
    throw createHttpError(401, "Missing access token");
  }

  // Підроблена cookie не має ставати 400 — фронт чекає саме 401, щоб піти в логін
  if (!isValidObjectId(sessionId)) {
    throw createHttpError(401, "Session not found");
  }

  const session = await Session.findOne({
    _id: sessionId,
    accessToken,
  });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  const isAccessTokenExpired = session.accessTokenValidUntil < new Date();

  if (isAccessTokenExpired) {
    throw createHttpError(401, "Access token expired");
  }

  const user = await User.findById(session.userId).select("-password");

  if (!user) {
    throw createHttpError(401, "User not found");
  }

  req.user = user;

  next();
};
