import { Joi, Segments } from "celebrate";
import {
  nameField,
  emailField,
  commentField,
  phoneField,
} from "./commonValidation.js";

export const appointmentSchema = {
  [Segments.BODY]: Joi.object({
    parentName: nameField,
    email: emailField,
    address: Joi.string().min(5).required().trim().messages({
      "string.min": "Address must be at least 5 characters long",
      "string.empty": "Address cannot be empty",
      "any.required": "Address is a required field",
    }),
    phone: phoneField,
    childAge: Joi.string().required().trim().messages({
      "string.empty": "Child's age cannot be empty",
      "any.required": "Child's age is a required field",
    }),
    time: Joi.string().required().trim().messages({
      "string.empty": "Time cannot be empty",
      "any.required": "Time is a required field",
    }),
    comment: commentField,
  }),
};
