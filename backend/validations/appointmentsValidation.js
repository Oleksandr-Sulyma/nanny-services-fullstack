import { Joi, Segments } from "celebrate";
import {
  nameField,
  emailField,
  commentField,
  requiredCommentField,
  phoneField,
  idField,
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

export const updateAppointmentStatusSchema = {
  [Segments.PARAMS]: Joi.object({
    appointmentId: idField,
  }),
  [Segments.BODY]: Joi.object({
    status: Joi.string().valid("accepted", "rejected").required().messages({
      "any.only": "Status must be one of: accepted, rejected",
      "any.required": "Status is a required field",
    }),
  }),
};

export const appointmentIdSchema = {
  [Segments.PARAMS]: Joi.object({
    appointmentId: idField,
  }),
};

export const createReviewSchema = {
  [Segments.PARAMS]: Joi.object({
    appointmentId: idField,
  }),
  [Segments.BODY]: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
      "number.base": "Rating must be a number",
      "number.integer": "Rating must be an integer",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating must be at most 5",
      "any.required": "Rating is a required field",
    }),
    comment: requiredCommentField,
  }),
};
