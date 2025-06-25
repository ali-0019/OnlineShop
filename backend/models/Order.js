import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      phone: String,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: [
        "credit_card",
        "debit_card",
        "paypal",
        "cash_on_delivery",
        "bank_transfer",
      ],
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
      min: [0, "Items price cannot be negative"],
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
      min: [0, "Tax price cannot be negative"],
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
      min: [0, "Shipping price cannot be negative"],
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
      min: [0, "Total price cannot be negative"],
    },
    discount: {
      amount: {
        type: Number,
        default: 0,
        min: [0, "Discount amount cannot be negative"],
      },
      code: String,
      type: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "fixed",
      },
    },
    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot be more than 500 characters"],
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

// Add status to history when status changes
orderSchema.pre("save", function (next) {
  if (this.isModified("status") && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  next();
});

// Indexes for better performance
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ isPaid: 1 });
orderSchema.index({ isDelivered: 1 });

export default mongoose.model("Order", orderSchema);
