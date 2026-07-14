import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getSellerOrders,
  getSellerStats,
  updateOrderStatus,
  getAdminStats,
  getAllOrders,
} from "../controllers/order.controller";
import { protect, restrictTo } from "../middleware/auth.middleware";

const router = Router();

router.post("/", protect, restrictTo("buyer"), createOrder);
router.get("/my-orders", protect, restrictTo("buyer"), getMyOrders);
router.get("/seller-orders", protect, restrictTo("seller", "admin"), getSellerOrders);
router.get("/seller-stats", protect, restrictTo("seller", "admin"), getSellerStats);
router.get("/admin-stats", protect, restrictTo("admin"), getAdminStats);
router.get("/", protect, restrictTo("admin"), getAllOrders);
router.patch("/:id/status", protect, restrictTo("seller", "admin"), updateOrderStatus);

export default router;