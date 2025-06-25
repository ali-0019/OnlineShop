import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  getProductReviews,
  searchProducts,
  getFeaturedProducts,
} from "../controllers/productController.js";
import { protect, authorize, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProduct);
router.get("/:id/reviews", getProductReviews);

// Private routes
router.post("/:id/reviews", protect, addProductReview);

// Admin routes
router.post("/", protect, authorize("admin"), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
