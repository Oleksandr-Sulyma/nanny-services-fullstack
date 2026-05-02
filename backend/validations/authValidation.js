import { Joi, Segments } from "celebrate";

export const registerValidation = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(3).required().trim().messages({
      "string.min": "Name must be at least 3 characters long",
      "string.empty": "Name cannot be empty",
      "any.required": "Name is a required field",
    }),
    email: Joi.string().email().required().trim().lowercase().messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email cannot be empty",
      "any.required": "Email is a required field",
    }),
    password: Joi.string()
      .min(8)
      .required()
      .pattern(/^[\x21-\x7E]+$/)
      .messages({
        "string.pattern.base":
          "Password must contain only Latin letters, numbers, and symbols without spaces",
        "string.min": "Password must be at least 8 characters long",
        "string.empty": "Password cannot be empty",
        "any.required": "Password is a required field",
      }),
  }),
};

export const loginValidation = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email().trim().lowercase().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is a required field",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is a required field",
    }),
  }),
};
