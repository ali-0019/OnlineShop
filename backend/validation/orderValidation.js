import Joi from "joi";

export const validateOrder = (data) => {
  const schema = Joi.object({
    orderItems: Joi.array()
      .items(
        Joi.object({
          product: Joi.string().required(),
          name: Joi.string().required(),
          image: Joi.string().required(),
          price: Joi.number().min(0).required(),
          quantity: Joi.number().integer().min(1).required(),
        })
      )
      .min(1)
      .required()
      .messages({
        "array.min": "At least one item is required",
      }),
    shippingAddress: Joi.object({
      address: Joi.string().required(),
      city: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
      phone: Joi.string().optional(),
    }).required(),
    paymentMethod: Joi.string()
      .valid(
        "credit_card",
        "debit_card",
        "paypal",
        "cash_on_delivery",
        "bank_transfer"
      )
      .required(),
    itemsPrice: Joi.number().min(0).required(),
    taxPrice: Joi.number().min(0).optional(),
    shippingPrice: Joi.number().min(0).optional(),
    totalPrice: Joi.number().min(0).required(),
    notes: Joi.string().max(500).optional(),
  });

  return schema.validate(data);
};

export const validateUpdateOrderStatus = (data) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid(
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded"
      )
      .required(),
    trackingNumber: Joi.string().optional(),
    notes: Joi.string().max(500).optional(),
  });

  return schema.validate(data);
};

export const validatePaymentResult = (data) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    status: Joi.string().required(),
    update_time: Joi.string().optional(),
    email_address: Joi.string().email().optional(),
  });

  return schema.validate(data);
};
