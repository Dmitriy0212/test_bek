import { Joi, Segments } from "celebrate";
import { emailSchema } from "./emailSchema.js";

export const registerSchema = {
  [Segments.BODY]: Joi.object({
      name: Joi.string()
      .trim()
      .min(2)
      .max(32)
      .pattern(/^(?=.*[A-Za-zА-Яа-яІіЇїЄєҐґ])[A-Za-zА-Яа-яІіЇїЄєҐґ0-9\s'-]+$/)
      .required(),

    email: emailSchema().required(),

    password: Joi.string()
      .trim()
      .min(8)
      .max(64)
      .pattern(/\S/)
      .custom((value, helpers) => {
        if (Buffer.byteLength(value, "utf8") > 72) {
          return helpers.error("string.maxBytes");
        }

        return value;
      })
      .messages({
        "string.maxBytes": "Password must not exceed 72 bytes",
      })
      .required(),
  }),
};

export const loginSchema = {
  [Segments.BODY]: Joi.object({
    email: emailSchema().required(),
    password: Joi.string().trim().required(),
  }),
};
