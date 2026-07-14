import { Request, Response } from "express";
import mongoose from "mongoose";
import Wishlist from "../models/Wishlist";
import type { AuthRequest } from "../types";

export async function addToWishlist(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { productId } = req.body;

    if (!productId) {
      res.status(400).json({ message: "Product ID is required." });
      return;
    }

    const exists = await Wishlist.findOne({
      user: req.user?.userId,
      product: productId,
    });

    if (exists) {
      res.status(409).json({
        message: "Product already exists in wishlist.",
      });
      return;
    }

    const item = await Wishlist.create({
      user: new mongoose.Types.ObjectId(req.user!.userId),
      product: new mongoose.Types.ObjectId(productId),
    });

    res.status(201).json({
      message: "Added to wishlist.",
      item,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to add wishlist item.",
    });
  }
}

export async function getWishlist(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const items = await Wishlist.find({
      user: req.user?.userId,
    }).populate("product");

    res.json({
      items,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to load wishlist.",
    });
  }
}

export async function removeWishlist(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    await Wishlist.findOneAndDelete({
      user: req.user?.userId,
      product: req.params.id,
    });

    res.json({
      message: "Wishlist item removed.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to remove wishlist item.",
    });
  }
}