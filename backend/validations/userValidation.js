import { Joi, Segments } from "celebrate";
import { passwordField } from "./commonValidation.js";

export const updateAvatarSchema = {
  [Segments.BODY]: Joi.object({
    avatar: Joi.string().uri().required().messages({
      "string.uri": "Avatar must be a valid URL",
      "any.required": "Avatar URL is a required field",
    }),
  }),
};

export const updatePasswordSchema = {
  [Segments.BODY]: Joi.object({
    oldPassword: Joi.string().required().messages({
      "string.empty": "Old password cannot be empty",
      "any.required": "oldPassword is a required field",
    }),
    newPassword: passwordField,
  }),
};