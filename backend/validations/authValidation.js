import { Joi, Segments } from "celebrate";
import { nameField, emailField, passwordField } from "./commonValidation.js";


export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    name:nameField,
    email: emailField,
    password: passwordField,
    role: Joi.string().valid("parent", "nanny").required(),
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
