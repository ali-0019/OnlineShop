import Joi from "joi";

export const validateCategory = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      "string.empty": "Category name is required",
      "string.min": "Category name must be at least 2 characters",
      "string.max": "Category name cannot exceed 50 characters",
    }),
    description: Joi.string().max(500).optional(),
    image: Joi.string().optional(),
    parentCategory: Joi.string().optional(),
    sortOrder: Joi.number().integer().min(0).optional(),
    isActive: Joi.boolean().optional(),
  });

  return schema.validate(data);
};

export const validateCategoryUpdate = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    description: Joi.string().max(500).optional(),
    image: Joi.string().optional(),
    parentCategory: Joi.string().optional(),
    sortOrder: Joi.number().integer().min(0).optional(),
    isActive: Joi.boolean().optional(),
  });

  return schema.validate(data);
};
