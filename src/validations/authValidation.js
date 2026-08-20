import { Joi, Segments } from "celebrate";
import { emailSchema } from "./emailSchema.js";

export const registerSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(32)
      .pattern(/^(?=.*[A-Za-zА-Яа-яІіЇїЄєҐґ])[A-Za-zА-Яа-яІіЇїЄєҐґ0-9\s'-]+$/)
      .messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 2 characters long",
        "string.max": "Name must not exceed 32 characters",
        "string.pattern.base":
          "Name can contain only letters, numbers, spaces, apostrophe and hyphen",
        "any.required": "Name is required",
      })
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
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password must not exceed 64 characters",
        "string.pattern.base": "Password cannot contain only spaces",
        "string.maxBytes": "Password is too long",
        "any.required": "Password is required",
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
