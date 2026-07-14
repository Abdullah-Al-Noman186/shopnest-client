import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyListings,
} from "../controllers/product.controller";
import { protect, restrictTo } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getAllProducts);
router.get("/my-listings", protect, restrictTo("seller", "admin"), getMyListings);
router.get("/:id", getProductById);
router.post("/", protect, restrictTo("seller", "admin"), createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;