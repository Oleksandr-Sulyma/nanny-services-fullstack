import { Joi, Segments } from "celebrate";
import { idField } from "./commonValidation.js";
import { getAllowedBirthDate } from "../constants/time.js";

export const getNanniesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(3).max(20).default(3),
    region: Joi.string().trim().lowercase().min(1),
    sort: Joi.string()
      .valid(
        "a_to_z",
        "z_to_a",
        "popular",
        "not_popular",
        "price_asc",
        "price_desc",
      )
      .default("a_to_z")
      .messages({
        "any.only":
          "Sort must be one of: a_to_z, z_to_a, popular, not_popular, price_asc, price_desc",
      }),
    filter: Joi.string()
      .valid("less_than_18", "greater_than_18", "show_all")
      .default("show_all")
      .messages({
        "any.only":
          "Filter must be one of: less_than_18, greater_than_18, show_all",
      }),
  }),
};

export const nannyIdSchema = {
  [Segments.PARAMS]: Joi.object({
    nannyId: idField,
  }),
};

export const favoriteNannySchema = {
  [Segments.BODY]: Joi.object({
    nannyId: idField,
  }),
};

export const updateMyNannyProfileSchema = {
  [Segments.BODY]: Joi.object({
    avatar_url: Joi.string().uri(),
    birthday: Joi.date()
      .min(getAllowedBirthDate(70))
      .max(getAllowedBirthDate(16))
      .messages({
        "date.base": "Birth date must be a valid date",
        "date.min": "Maximum allowed age is 70 years",
        "date.max": "Minimum allowed age is 16 years",
      }),
    experience: Joi.string().trim().min(1),
    education: Joi.string().trim().min(1),
    kids_age: Joi.string().trim().min(1),
    price_per_hour: Joi.number().positive(),
    location: Joi.object({
      country: Joi.string().trim().lowercase().required(),
      region: Joi.string().trim().lowercase().required(),
      settlement: Joi.string().trim().lowercase().required(),
    }),
    about: Joi.string().trim().min(1),
    characters: Joi.array().items(Joi.string().trim().min(1)).min(1),
  }).min(1),
};
