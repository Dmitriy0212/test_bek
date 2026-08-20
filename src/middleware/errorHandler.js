import { HttpError } from "http-errors";
import multer from "multer";
import { isCelebrateError } from "celebrate";
export const errorHandler = (err, req, res, next) => {
  console.error("Error Middleware:", err);

  // Joi / Celebrate validation errors
  if (isCelebrateError(err)) {
    for (const segment of err.details.keys()) {
      const error = err.details.get(segment);
      const message = error?.details?.[0]?.message;

      if (message) {
        return res.status(400).json({
          message,
        });
      }
    }

    return res.status(400).json({
      message: "Please check the entered data",
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message || err.name,
    });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  // Невалідний ObjectId (напр. підроблена cookie sessionId або кривий :id у шляху)
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid id",
    });
  }

  // Порушення схеми Mongoose (minlength/maxlength/enum/required)
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  // Унікальний індекс — у нас це лише email у моделі User
  if (err.code === 11000) {
    return res.status(409).json({
      message: "Email is already in use",
    });
  }

  // Cloudinary SDK кидає плоскі обʼєкти, не HttpError
  if (err.http_code) {
    return res.status(err.http_code).json({
      message: err.message,
    });
  }

  const isProd = process.env.NODE_ENV === "production";

  res.status(500).json({
    message: isProd ? "Something went wrong. Please try again later." : err.message,
  });
};
