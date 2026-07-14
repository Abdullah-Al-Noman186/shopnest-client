import { Router } from "express";
import {
  addToWishlist,
  getWishlist,
  removeWishlist,
} from "../controllers/wishlist.controller";

import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/", protect, getWishlist);

router.post("/", protect, addToWishlist);

router.delete("/:id", protect, removeWishlist);

export default router;