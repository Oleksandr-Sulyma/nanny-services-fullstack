import { Joi } from "celebrate";
import { isValidObjectId } from "mongoose";

export const emailField = Joi.string()
  .email()
  .required()
  .trim()
  .lowercase()
  .messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email cannot be empty",
    "any.required": "Email is a required field",
  });

export const passwordField = Joi.string()
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

export const nameField = Joi.string().min(3).required().trim().messages({
  "string.min": "Name must be at least 3 characters long",
  "string.empty": "Name cannot be empty",
  "any.required": "Name is a required field",
});

export const commentField = Joi.string().min(3).trim().messages({
  "string.min": "Comment must be at least 3 characters long",
  "string.empty": "Comment cannot be empty",
});

const phoneRegex = /^\+380\d{9}$/;

export const phoneField = Joi.string()
  .pattern(phoneRegex)
  .required()
  .messages({
    "string.pattern.base": "Phone number must start with +380 and contain 9 digits after it (e.g., +380671234567)",
    "string.empty": "Phone number is required",
    "any.required": "Phone is a required field",
  });

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message("Invalid ID format") : value;
};

export const idField = Joi.string()
  .custom(objectIdValidator)
  .required()
  .messages({
    "any.required": "Id is a required field",
  });
