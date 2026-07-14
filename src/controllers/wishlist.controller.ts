import { Response } from "express";
import mongoose from "mongoose";
import Wishlist from "../models/Wishlist";
import type { AuthRequest } from "../types";

export async function addToWishlist(
  req: AuthRequest,
  res: Response
) {
  try {
    const { productId } = req.body;

    const exists = await Wishlist.findOne({
      user: req.user!.userId,
      product: productId,
    });

    if (exists) {
      return res.status(409).json({
        message: "Already in wishlist",
      });
    }

    await Wishlist.create({
      user: new mongoose.Types.ObjectId(req.user!.userId),
      product: new mongoose.Types.ObjectId(productId),
    });

    res.status(201).json({
      message: "Added to wishlist",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed",
    });
  }
}

export async function getWishlist(
  req: AuthRequest,
  res: Response
) {
  const items = await Wishlist.find({
    user: req.user!.userId,
  }).populate("product");

  res.json({
    items,
  });
}

export async function removeWishlist(
  req: AuthRequest,
  res: Response
) {
  await Wishlist.findOneAndDelete({
    user: req.user!.userId,
    product: req.params.id,
  });

  res.json({
    message: "Removed",
  });
}