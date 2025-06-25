import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import { APIFilters } from "../utils/helpers.js";
import {
  validateProduct,
  validateProductUpdate,
  validateReview,
} from "../validation/productValidation.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource and populate
  let query = Product.find(JSON.parse(queryStr))
    .populate("category", "name slug")
    .populate("createdBy", "name");

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Product.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const products = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    data: {
      products,
      pagination: {
        ...pagination,
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name slug description")
    .populate("createdBy", "name")
    .populate("reviews.user", "name avatar");

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "Product retrieved successfully",
    data: product,
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res, next) => {
  // Validate input
  const { error } = validateProduct(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  // Add user to req.body
  req.body.createdBy = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res, next) => {
  // Validate input
  const { error } = validateProductUpdate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: {},
  });
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const addProductReview = asyncHandler(async (req, res, next) => {
  // Validate input
  const { error } = validateReview(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user already reviewed this product
  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return next(new ErrorResponse("Product already reviewed", 400));
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.calculateAverageRating();

  await product.save();

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    data: {},
  });
});

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "reviews.user",
    "name avatar"
  );

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "Reviews retrieved successfully",
    data: product.reviews,
  });
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = asyncHandler(async (req, res, next) => {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    brand,
    sort,
    page = 1,
    limit = 10,
  } = req.query;

  if (!q) {
    return next(new ErrorResponse("Search query is required", 400));
  }

  let query = {};

  // Text search
  query.$text = { $search: q };

  // Category filter
  if (category) {
    query.category = category;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Brand filter
  if (brand) {
    query.brand = new RegExp(brand, "i");
  }

  // Only active products
  query.isActive = true;

  // Execute query
  let productQuery = Product.find(query)
    .populate("category", "name slug")
    .select("-reviews");

  // Sort
  if (sort) {
    const sortBy = sort.split(",").join(" ");
    productQuery = productQuery.sort(sortBy);
  } else {
    productQuery = productQuery.sort({ score: { $meta: "textScore" } });
  }

  // Pagination
  const skip = (page - 1) * limit;
  const total = await Product.countDocuments(query);

  productQuery = productQuery.skip(skip).limit(Number(limit));

  const products = await productQuery;

  res.status(200).json({
    success: true,
    message: "Search results retrieved successfully",
    data: {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate("category", "name slug")
    .select("-reviews")
    .sort("-createdAt")
    .limit(10);

  res.status(200).json({
    success: true,
    message: "Featured products retrieved successfully",
    data: products,
  });
});
