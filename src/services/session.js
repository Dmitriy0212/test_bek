import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/session.js";
import { Session } from "../models/index.js";

export const createSession = async (userId) => {
  const accessToken = crypto.randomUUID();
  const refreshToken = crypto.randomUUID();
  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

// Ті самі прапорці треба передати і в clearCookie, інакше браузер не зіставить
// куку з тією, що ставилась, і не видалить її. Тому винесено окремо.
export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };
};

export const setSessionCookies = (res, session) => {
  const cookieOptions = getCookieOptions();

  res.cookie("accessToken", session.accessToken, {
    ...cookieOptions,
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie("refreshToken", session.refreshToken, {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });

  res.cookie("sessionId", session._id.toString(), {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });
};
