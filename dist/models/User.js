"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required."],
        trim: true,
        minlength: 2,
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    avatar: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ["buyer", "seller", "admin"],
        default: "buyer",
    },
    status: {
        type: String,
        enum: ["active", "blocked"],
        default: "active",
    },
}, { timestamps: true });
const User = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);
exports.default = User;
