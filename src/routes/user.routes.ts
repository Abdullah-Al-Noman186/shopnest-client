import { Router } from "express";
import {
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
} from "../controllers/user.controller";
import { protect, restrictTo } from "../middleware/auth.middleware";

const router = Router();

// Admin only
router.get("/", protect, restrictTo("admin"), getAllUsers);
router.patch("/:id/block", protect, restrictTo("admin"), blockUser);
router.patch("/:id/unblock", protect, restrictTo("admin"), unblockUser);
router.delete("/:id", protect, restrictTo("admin"), deleteUser);

export default router;