"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Product title is required."],
        trim: true,
        minlength: 3,
    },
    description: {
        type: String,
        required: [true, "Description is required."],
        trim: true,
        minlength: 10,
    },
    price: {
        type: Number,
        required: [true, "Price is required."],
        min: 0,
    },
    category: {
        type: String,
        required: [true, "Category is required."],
        enum: [
            "Electronics",
            "Fashion",
            "Home & Living",
            "Sports",
            "Books",
            "Beauty",
        ],
    },
    stock: {
        type: Number,
        default: 1,
        min: 0,
    },
    images: {
        type: [String],
        default: [],
    },
    seller: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
}, {
    timestamps: true,
});
const Product = mongoose_1.models.Product || (0, mongoose_1.model)("Product", productSchema);
exports.default = Product;
