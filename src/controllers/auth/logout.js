import { Session } from "../../models/index.js";
import { getCookieOptions } from "../../services/session.js";

export const logout = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  // Прапорці мають збігатися з тими, з якими куки ставилися: у проді це
  // secure + sameSite "none". Без них браузер не зіставить куку з наявною
  // і не видалить її — сесія зникне з бази, а куки лишаться в браузері.
  const cookieOptions = getCookieOptions();

  res.clearCookie("sessionId", cookieOptions);
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(204).send();
};
