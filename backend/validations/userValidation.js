import { Joi, Segments } from "celebrate";

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
    newPassword: Joi.string()
      .min(8)
      .required()
      .pattern(/^[\x21-\x7E]+$/)
      .messages({
        "string.pattern.base":
          "Password must contain only Latin letters, numbers, and symbols without spaces",
        "string.min": "Password must be at least 8 characters long",
        "string.empty": "Password cannot be empty",
        "any.required": "newPassword is a required field",
      }),
  }),
};