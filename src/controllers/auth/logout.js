import { isValidObjectId } from "mongoose";
import { Session } from "../../models/index.js";
import { getCookieOptions } from "../../services/session.js";

export const logout = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId && isValidObjectId(sessionId)) {
    await Session.deleteOne({ _id: sessionId });
  }

  const cookieOptions = getCookieOptions();

  res.clearCookie("sessionId", cookieOptions);
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(204).send();
};
