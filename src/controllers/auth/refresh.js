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

  const session = await Session.findById(sessionId);

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  if (session.refreshToken !== refreshToken) {
    throw createHttpError(401, "Invalid refresh token");
  }

  if (session.refreshTokenValidUntil < new Date()) {
    await Session.findByIdAndDelete(sessionId);

    throw createHttpError(401, "Refresh token expired");
  }

  const userId = session.userId;

  await Session.findByIdAndDelete(sessionId);

  const newSession = await createSession(userId);

  setSessionCookies(res, newSession);

  res.status(200).json({
    status: 200,
    message: "Successfully refreshed a session!",
    data: {
      accessToken: newSession.accessToken,
    },
  });
};