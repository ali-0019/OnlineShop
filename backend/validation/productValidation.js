import Joi from "joi";

export const validateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      "string.empty": "Product name is required",
      "string.min": "Product name must be at least 2 characters",
      "string.max": "Product name cannot exceed 100 characters",
    }),
    description: Joi.string().max(2000).required().messages({
      "string.empty": "Product description is required",
      "string.max": "Description cannot exceed 2000 characters",
    }),
    shortDescription: Joi.string().max(500).optional(),
    price: Joi.number().min(0).required().messages({
      "number.base": "Price must be a number",
      "number.min": "Price cannot be negative",
      "any.required": "Price is required",
    }),
    originalPrice: Joi.number().min(0).optional(),
    discount: Joi.number().min(0).max(100).optional(),
    images: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().required(),
          alt: Joi.string().optional(),
          isPrimary: Joi.boolean().optional(),
        })
      )
      .min(1)
      .required()
      .messages({
        "array.min": "At least one image is required",
      }),
    category: Joi.string().required().messages({
      "string.empty": "Category is required",
    }),
    brand: Joi.string().optional(),
    sku: Joi.string().required().messages({
      "string.empty": "SKU is required",
    }),
    stock: Joi.number().integer().min(0).required().messages({
      "number.base": "Stock must be a number",
      "number.integer": "Stock must be an integer",
      "number.min": "Stock cannot be negative",
      "any.required": "Stock is required",
    }),
    lowStockThreshold: Joi.number().integer().min(0).optional(),
    specifications: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          value: Joi.string().required(),
        })
      )
      .optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    weight: Joi.number().min(0).optional(),
    dimensions: Joi.object({
      length: Joi.number().min(0).optional(),
      width: Joi.number().min(0).optional(),
      height: Joi.number().min(0).optional(),
    }).optional(),
    metaTitle: Joi.string().optional(),
    metaDescription: Joi.string().optional(),
    isFeatured: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
  });

  return schema.validate(data);
};

export const validateProductUpdate = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(2000).optional(),
    shortDescription: Joi.string().max(500).optional(),
    price: Joi.number().min(0).optional(),
    originalPrice: Joi.number().min(0).optional(),
    discount: Joi.number().min(0).max(100).optional(),
    images: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().required(),
          alt: Joi.string().optional(),
          isPrimary: Joi.boolean().optional(),
        })
      )
      .optional(),
    category: Joi.string().optional(),
    brand: Joi.string().optional(),
    stock: Joi.number().integer().min(0).optional(),
    lowStockThreshold: Joi.number().integer().min(0).optional(),
    specifications: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          value: Joi.string().required(),
        })
      )
      .optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    weight: Joi.number().min(0).optional(),
    dimensions: Joi.object({
      length: Joi.number().min(0).optional(),
      width: Joi.number().min(0).optional(),
      height: Joi.number().min(0).optional(),
    }).optional(),
    metaTitle: Joi.string().optional(),
    metaDescription: Joi.string().optional(),
    isFeatured: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
  });

  return schema.validate(data);
};

export const validateReview = (data) => {
  const schema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
      "number.base": "Rating must be a number",
      "number.integer": "Rating must be an integer",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating cannot be more than 5",
      "any.required": "Rating is required",
    }),
    comment: Joi.string().max(1000).required().messages({
      "string.empty": "Comment is required",
      "string.max": "Comment cannot exceed 1000 characters",
    }),
  });

  return schema.validate(data);
};
