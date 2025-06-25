import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate({
    path: "items.product",
    select: "name price images stock isActive",
    populate: {
      path: "category",
      select: "name",
    },
  });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  // Filter out inactive products
  if (cart.items.length > 0) {
    cart.items = cart.items.filter(
      (item) => item.product && item.product.isActive && item.product.stock > 0
    );
    await cart.save();
  }

  res.status(200).json({
    success: true,
    message: "Cart retrieved successfully",
    data: cart,
  });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return next(new ErrorResponse("Product ID is required", 400));
  }

  if (quantity < 1) {
    return next(new ErrorResponse("Quantity must be at least 1", 400));
  }

  // Check if product exists and is active
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorResponse("Product not found", 404));
  }

  if (!product.isActive) {
    return next(new ErrorResponse("Product is not available", 400));
  }

  if (product.stock < quantity) {
    return next(
      new ErrorResponse(`Only ${product.stock} items available in stock`, 400)
    );
  }

  // Get or create cart
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex >= 0) {
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;

    if (product.stock < newQuantity) {
      return next(
        new ErrorResponse(`Only ${product.stock} items available in stock`, 400)
      );
    }

    cart.items[existingItemIndex].quantity = newQuantity;
    cart.items[existingItemIndex].price =
      product.discountedPrice || product.price;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.discountedPrice || product.price,
    });
  }

  await cart.save();

  // Populate the cart before returning
  await cart.populate({
    path: "items.product",
    select: "name price images stock isActive",
    populate: {
      path: "category",
      select: "name",
    },
  });

  res.status(200).json({
    success: true,
    message: "Item added to cart successfully",
    data: cart,
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  if (!quantity || quantity < 0) {
    return next(new ErrorResponse("Valid quantity is required", 400));
  }

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ErrorResponse("Cart not found", 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId
  );
  if (itemIndex === -1) {
    return next(new ErrorResponse("Item not found in cart", 404));
  }

  // Get product to check stock
  const product = await Product.findById(cart.items[itemIndex].product);
  if (!product) {
    return next(new ErrorResponse("Product not found", 404));
  }

  if (quantity === 0) {
    // Remove item from cart
    cart.items.splice(itemIndex, 1);
  } else {
    if (product.stock < quantity) {
      return next(
        new ErrorResponse(`Only ${product.stock} items available in stock`, 400)
      );
    }

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.discountedPrice || product.price;
  }

  await cart.save();

  // Populate the cart before returning
  await cart.populate({
    path: "items.product",
    select: "name price images stock isActive",
    populate: {
      path: "category",
      select: "name",
    },
  });

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: cart,
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ErrorResponse("Cart not found", 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId
  );
  if (itemIndex === -1) {
    return next(new ErrorResponse("Item not found in cart", 404));
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();

  // Populate the cart before returning
  await cart.populate({
    path: "items.product",
    select: "name price images stock isActive",
    populate: {
      path: "category",
      select: "name",
    },
  });

  res.status(200).json({
    success: true,
    message: "Item removed from cart successfully",
    data: cart,
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ErrorResponse("Cart not found", 404));
  }

  cart.items = [];
  cart.totalAmount = 0;
  cart.totalItems = 0;
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    data: cart,
  });
});

// @desc    Get cart item count
// @route   GET /api/cart/count
// @access  Private
export const getCartItemCount = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  const count = cart ? cart.totalItems : 0;

  res.status(200).json({
    success: true,
    message: "Cart item count retrieved successfully",
    data: { count },
  });
});
