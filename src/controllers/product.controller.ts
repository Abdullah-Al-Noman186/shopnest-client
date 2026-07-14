import { Request, Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import Product from "../models/Product";
import type { AuthRequest } from "../types";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Sports",
  "Books",
  "Beauty",
] as const;

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  category: z.enum(CATEGORIES),
  stock: z.coerce.number().min(0).default(1),
  images: z.array(z.string().url()).default([]),
});

const updateSchema = productSchema.partial().extend({
  status: z.enum(["active", "inactive"]).optional(),
});

export async function getAllProducts(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { category, search } = req.query;

    const query: Record<string, unknown> = {
      status: "active",
    };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    const products = await Product.find(query)
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch products.",
    });
  }
}

export async function getProductById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "name email")
      .lean();

    if (!product) {
      res.status(404).json({
        message: "Product not found.",
      });
      return;
    }

    res.json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch product.",
    });
  }
}

export async function createProduct(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const result = productSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: result.error.issues[0].message,
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized.",
      });
      return;
    }

    const product = await Product.create({
      ...result.data,
      seller: new mongoose.Types.ObjectId(req.user.userId),
    });

    res.status(201).json({
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create product.",
    });
  }
}

export async function updateProduct(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const result = updateSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: result.error.issues[0].message,
      });
      return;
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        message: "Product not found.",
      });
      return;
    }

    const isOwner = product.seller.toString() === req.user?.userId;
    const isAdmin = req.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        message: "You cannot edit this product.",
      });
      return;
    }

    Object.assign(product, result.data);

    await product.save();

    res.json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update product.",
    });
  }
}

export async function deleteProduct(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        message: "Product not found.",
      });
      return;
    }

    const isOwner = product.seller.toString() === req.user?.userId;
    const isAdmin = req.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        message: "You cannot delete this product.",
      });
      return;
    }

    await product.deleteOne();

    res.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete product.",
    });
  }
}

export async function getMyListings(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized.",
      });
      return;
    }

    const products = await Product.find({
      seller: new mongoose.Types.ObjectId(req.user.userId),
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      products: products.map((p) => ({
        id: p._id.toString(),
        title: p.title,
        category: p.category,
        price: p.price,
        stock: p.stock,
        status: p.status,
        image: p.images?.[0] ?? "",
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to load listings.",
    });
  }
}