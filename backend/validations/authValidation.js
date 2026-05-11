import { Joi, Segments } from "celebrate";

const emailField = Joi.string().email().required().trim().lowercase().messages({
  "string.email": "Please enter a valid email address",
  "string.empty": "Email cannot be empty",
  "any.required": "Email is a required field",
});

const passwordField = Joi.string()
  .min(8)
  .required()
  .pattern(/^[\x21-\x7E]+$/)
  .messages({
    "string.pattern.base":
      "Password must contain only Latin letters, numbers, and symbols without spaces",
    "string.min": "Password must be at least 8 characters long",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is a required field",
  });

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).required().trim().messages({
      "string.min": "Name must be at least 3 characters long",
      "string.empty": "Name cannot be empty",
      "any.required": "Name is a required field",
    }),
    email: emailField,
    password: passwordField,
  }),
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: emailField,
    password: Joi.string().required().messages({
      "any.required": "Password is a required field",
    }),
  }),
};
