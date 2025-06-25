import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res, next) => {
  const {
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    orderItems,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorResponse("No order items provided", 400));
  }

  if (!shippingAddress || !paymentMethod) {
    return next(
      new ErrorResponse("Shipping address and payment method are required", 400)
    );
  }

  // Validate order items and check stock
  for (let item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new ErrorResponse(`Product not found: ${item.product}`, 404));
    }

    if (!product.isActive) {
      return next(
        new ErrorResponse(`Product is not available: ${product.name}`, 400)
      );
    }

    if (product.stock < item.quantity) {
      return next(
        new ErrorResponse(
          `Insufficient stock for product: ${product.name}`,
          400
        )
      );
    }
  }

  const order = await Order.create({
    user: req.user.id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // Update product stock
  for (let item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  // Clear user's cart
  await Cart.findOneAndUpdate(
    { user: req.user.id },
    { items: [], totalAmount: 0, totalItems: 0 }
  );

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const total = await Order.countDocuments({ user: req.user.id });
  const orders = await Order.find({ user: req.user.id })
    .populate("orderItems.product", "name slug")
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    message: "Orders retrieved successfully",
    data: {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product", "name slug images");

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user can only access their own orders (unless admin)
  if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to access this order", 401));
  }

  res.status(200).json({
    success: true,
    message: "Order retrieved successfully",
    data: order,
  });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user can only update their own orders (unless admin)
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to update this order", 401));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  };

  if (order.status === "pending") {
    order.status = "processing";
  }

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    message: "Order updated to paid successfully",
    data: updatedOrder,
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user can only cancel their own orders (unless admin)
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to cancel this order", 401));
  }

  // Can only cancel pending or processing orders
  if (!["pending", "processing"].includes(order.status)) {
    return next(
      new ErrorResponse("Order cannot be cancelled at this stage", 400)
    );
  }

  order.status = "cancelled";

  // Restore product stock
  for (let item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data: updatedOrder,
  });
});

// Admin routes

// @desc    Get all orders
// @route   GET /api/orders/admin
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build filter query
  let filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.isPaid) {
    filter.isPaid = req.query.isPaid === "true";
  }

  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate("user", "name email")
    .populate("orderItems.product", "name")
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    message: "All orders retrieved successfully",
    data: {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, trackingNumber } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];

  if (!validStatuses.includes(status)) {
    return next(new ErrorResponse("Invalid status", 400));
  }

  order.status = status;

  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }

  if (status === "delivered") {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: updatedOrder,
  });
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getOrderStats = asyncHandler(async (req, res, next) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalPrice" },
        averageOrderValue: { $avg: "$totalPrice" },
      },
    },
  ]);

  const statusStats = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const monthlyStats = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        orders: { $sum: 1 },
        revenue: { $sum: "$totalPrice" },
      },
    },
    {
      $sort: { "_id.year": -1, "_id.month": -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    success: true,
    message: "Order statistics retrieved successfully",
    data: {
      overall: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
      },
      statusBreakdown: statusStats,
      monthlyTrends: monthlyStats,
    },
  });
});
