import Category from "../models/Category.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({ isActive: true })
    .populate("subcategories")
    .populate("productsCount")
    .sort("sortOrder name");

  res.status(200).json({
    success: true,
    message: "Categories retrieved successfully",
    data: categories,
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id)
    .populate("subcategories")
    .populate("productsCount");

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "Category retrieved successfully",
    data: category,
  });
});

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
export const getCategoryBySlug = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({
    slug: req.params.slug,
    isActive: true,
  })
    .populate("subcategories")
    .populate("productsCount");

  if (!category) {
    return next(
      new ErrorResponse(
        `Category not found with slug of ${req.params.slug}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    message: "Category retrieved successfully",
    data: category,
  });
});

// @desc    Get products by category
// @route   GET /api/categories/:id/products
// @access  Public
export const getCategoryProducts = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build query
  let query = { category: req.params.id, isActive: true };

  // Price filter
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }

  // Brand filter
  if (req.query.brand) {
    query.brand = new RegExp(req.query.brand, "i");
  }

  // Get total count
  const total = await Product.countDocuments(query);

  // Build product query
  let productQuery = Product.find(query)
    .populate("category", "name slug")
    .select("-reviews")
    .skip(skip)
    .limit(limit);

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    productQuery = productQuery.sort(sortBy);
  } else {
    productQuery = productQuery.sort("-createdAt");
  }

  const products = await productQuery;

  res.status(200).json({
    success: true,
    message: "Category products retrieved successfully",
    data: {
      category,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res, next) => {
  const { name, description, image, parentCategory } = req.body;

  // Check if category already exists
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return next(
      new ErrorResponse("Category with this name already exists", 400)
    );
  }

  const category = await Category.create({
    name,
    description,
    image,
    parentCategory,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if name is being updated and if it already exists
  if (req.body.name && req.body.name !== category.name) {
    const existingCategory = await Category.findOne({ name: req.body.name });
    if (existingCategory) {
      return next(
        new ErrorResponse("Category with this name already exists", 400)
      );
    }
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if category has products
  const productsCount = await Product.countDocuments({
    category: req.params.id,
  });
  if (productsCount > 0) {
    return next(
      new ErrorResponse("Cannot delete category that has products", 400)
    );
  }

  // Check if category has subcategories
  const subcategoriesCount = await Category.countDocuments({
    parentCategory: req.params.id,
  });
  if (subcategoriesCount > 0) {
    return next(
      new ErrorResponse("Cannot delete category that has subcategories", 400)
    );
  }

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: {},
  });
});

// @desc    Get category tree (hierarchical structure)
// @route   GET /api/categories/tree
// @access  Public
export const getCategoryTree = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({
    parentCategory: null,
    isActive: true,
  })
    .populate({
      path: "subcategories",
      match: { isActive: true },
      populate: {
        path: "subcategories",
        match: { isActive: true },
      },
    })
    .sort("sortOrder name");

  res.status(200).json({
    success: true,
    message: "Category tree retrieved successfully",
    data: categories,
  });
});
