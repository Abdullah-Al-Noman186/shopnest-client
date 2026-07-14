"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyListings = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const Product_1 = __importDefault(require("../models/Product"));
const CATEGORIES = [
    "Electronics",
    "Fashion",
    "Home & Living",
    "Sports",
    "Books",
    "Beauty",
];
const productSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters."),
    description: zod_1.z.string().min(10, "Description must be at least 10 characters."),
    price: zod_1.z.coerce.number().min(0, "Price cannot be negative."),
    category: zod_1.z.enum(CATEGORIES),
    stock: zod_1.z.coerce.number().min(0).default(1),
    images: zod_1.z.array(zod_1.z.string().url()).default([]),
});
const updateSchema = productSchema.partial().extend({
    status: zod_1.z.enum(["active", "inactive"]).optional(),
});
async function getAllProducts(req, res) {
    try {
        const { category, search } = req.query;
        const query = {
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
        const products = await Product_1.default.find(query)
            .populate("seller", "name email")
            .sort({ createdAt: -1 })
            .lean();
        res.json({ products });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch products.",
        });
    }
}
exports.getAllProducts = getAllProducts;
async function getProductById(req, res) {
    try {
        const product = await Product_1.default.findById(req.params.id)
            .populate("seller", "name email")
            .lean();
        if (!product) {
            res.status(404).json({
                message: "Product not found.",
            });
            return;
        }
        res.json({ product });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch product.",
        });
    }
}
exports.getProductById = getProductById;
async function createProduct(req, res) {
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
        const product = await Product_1.default.create({
            ...result.data,
            seller: new mongoose_1.default.Types.ObjectId(req.user.userId),
        });
        res.status(201).json({
            message: "Product created successfully.",
            product,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create product.",
        });
    }
}
exports.createProduct = createProduct;
async function updateProduct(req, res) {
    try {
        const result = updateSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: result.error.issues[0].message,
            });
            return;
        }
        const product = await Product_1.default.findById(req.params.id);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update product.",
        });
    }
}
exports.updateProduct = updateProduct;
async function deleteProduct(req, res) {
    try {
        const product = await Product_1.default.findById(req.params.id);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete product.",
        });
    }
}
exports.deleteProduct = deleteProduct;
async function getMyListings(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "Unauthorized.",
            });
            return;
        }
        const products = await Product_1.default.find({
            seller: new mongoose_1.default.Types.ObjectId(req.user.userId),
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Unable to load listings.",
        });
    }
}
exports.getMyListings = getMyListings;
