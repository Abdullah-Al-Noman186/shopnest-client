import { Router } from "express";
import {
  addToCart,
  getCart,
  updateCart,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller";

import { protect, restrictTo } from "../middleware/auth.middleware";

const router = Router();

// Buyer only
router.get("/", protect, restrictTo("buyer"), getCart);

router.post("/", protect, restrictTo("buyer"), addToCart);

router.patch("/:id", protect, restrictTo("buyer"), updateCart);

router.delete("/:id", protect, restrictTo("buyer"), removeCartItem);

router.delete("/", protect, restrictTo("buyer"), clearCart);

export default router;