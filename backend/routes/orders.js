import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderToPaid,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// User routes (require authentication)
router.use(protect);

router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/:id", getOrder);
router.put("/:id/pay", updateOrderToPaid);
router.put("/:id/cancel", cancelOrder);

// Admin routes
router.get("/admin/all", authorize("admin"), getAllOrders);
router.get("/admin/stats", authorize("admin"), getOrderStats);
router.put("/:id/status", authorize("admin"), updateOrderStatus);

export default router;
