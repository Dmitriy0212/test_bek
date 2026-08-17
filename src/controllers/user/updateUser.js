import createHttpError from "http-errors";
import { User } from "../../models/index.js";

export const updateUser = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { name, email } = req.body;

    if (email) {
      // collation: той самий регістронезалежний дублікат-чек, що вже є
      // в register/login (PR #63) — інакше "USER@x.com" проскакує повз
      // цю перевірку і ловиться лише унікальним індексом (E11000 у
      // errorHandler), а не цим явним повідомленням нижче.
      const existingUser = await User.findOne({ email, _id: { $ne: userId } }).collation({
        locale: "en",
        strength: 2,
      });

      if (existingUser) {
        throw createHttpError(409, "Email already in use");
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...(name && { name }), ...(email && { email }) },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json({
      status: 200,
      message: "User updated successfully",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};
