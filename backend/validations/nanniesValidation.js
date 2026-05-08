import { isValidObjectId } from "mongoose";
import { Joi, Segments } from "celebrate";

export const getNanniesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(3).max(20).default(3),
    sort: Joi.string()
      .valid('a_to_z', 'z_to_a', 'popular', 'not_popular')
      .default('a_to_z')
      .messages({
        'any.only': 'Sort must be one of: a_to_z, z_to_a, popular, not_popular',
      }),
    filter: Joi.string()
      .valid('less_than_18', 'greater_than_18', 'show_all')
      .default('show_all')
      .messages({
        'any.only': 'Filter must be one of: less_than_18, greater_than_18, show_all',
      }),
  }),
};

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid ID format') : value;
};

export const nannyIdSchema = {
    [Segments.PARAMS]: Joi.object({
    nannyId: Joi.string().custom(objectIdValidator).required(),
  }),
}