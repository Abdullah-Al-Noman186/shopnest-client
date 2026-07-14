import { Request, Response } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";
import type { AuthRequest } from "../types";

/**
 * POST /api/cart
 * Add product to cart
 */
export async function addToCart(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { productId } = req.body;

    if (!productId) {
      res.status(400).json({ message: "Product ID is required." });
      return;
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    let cartItem = await Cart.findOne({
      user: req.user!.userId,
      product: productId,
    });

    if (cartItem) {
      cartItem.quantity += 1;
      await cartItem.save();

      res.json({
        message: "Cart updated successfully.",
        item: cartItem,
      });
      return;
    }

    cartItem = await Cart.create({
      user: req.user!.userId,
      product: productId,
      quantity: 1,
    });

    res.status(201).json({
      message: "Added to cart.",
      item: cartItem,
    });
  } catch {
    res.status(500).json({
      message: "Unable to add product to cart.",
    });
  }
}

/**
 * GET /api/cart
 * Logged-in user's cart
 */
export async function getCart(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const items = await Cart.find({
      user: req.user!.userId,
    })
      .populate("product")
      .sort({
        createdAt: -1,
      });

    const total = items.reduce((sum: number, item: any) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    res.json({
      items,
      total,
    });
  } catch {
    res.status(500).json({
      message: "Unable to fetch cart.",
    });
  }
}

/**
 * PATCH /api/cart/:id
 * Update quantity
 */
export async function updateCart(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { quantity } = req.body;

    if (quantity < 1) {
      res.status(400).json({
        message: "Quantity must be at least 1.",
      });
      return;
    }

    const cartItem = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        quantity,
      },
      {
        new: true,
      }
    ).populate("product");

    if (!cartItem) {
      res.status(404).json({
        message: "Cart item not found.",
      });
      return;
    }

    res.json({
      message: "Cart updated successfully.",
      item: cartItem,
    });
  } catch {
    res.status(500).json({
      message: "Unable to update cart.",
    });
  }
}

/**
 * DELETE /api/cart/:id
 * Remove one item
 */
export async function removeCartItem(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const cartItem = await Cart.findByIdAndDelete(req.params.id);

    if (!cartItem) {
      res.status(404).json({
        message: "Cart item not found.",
      });
      return;
    }

    res.json({
      message: "Item removed from cart.",
    });
  } catch {
    res.status(500).json({
      message: "Unable to remove item.",
    });
  }
}

/**
 * DELETE /api/cart
 * Empty cart
 */
export async function clearCart(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    await Cart.deleteMany({
      user: req.user!.userId,
    });

    res.json({
      message: "Cart cleared successfully.",
    });
  } catch {
    res.status(500).json({
      message: "Unable to clear cart.",
    });
  }
}