import express from "express";
import {
  getCategories,
  getCategory,
  getCategoryBySlug,
  getCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree,
} from "../controllers/categoryController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getCategories);
router.get("/tree", getCategoryTree);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategory);
router.get("/:id/products", getCategoryProducts);

// Admin routes
router.post("/", protect, authorize("admin"), createCategory);
router.put("/:id", protect, authorize("admin"), updateCategory);
router.delete("/:id", protect, authorize("admin"), deleteCategory);

export default router;
