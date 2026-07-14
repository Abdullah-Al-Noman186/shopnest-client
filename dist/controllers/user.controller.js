"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.unblockUser = exports.blockUser = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
console.log("LOADED:", __filename);
async function getAllUsers(_req, res) {
    try {
        const users = await User_1.default.find().sort({ createdAt: -1 }).lean();
        res.json({
            users: users.map((u) => ({
                id: u._id.toString(),
                name: u.name,
                email: u.email,
                role: u.role,
                status: u.status,
                createdAt: u.createdAt,
            })),
        });
    }
    catch {
        res.status(500).json({ message: "Failed to fetch users." });
    }
}
exports.getAllUsers = getAllUsers;
async function blockUser(req, res) {
    try {
        const user = await User_1.default.findByIdAndUpdate(req.params.id, { status: "blocked" }, { new: true });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        res.json({ message: "User blocked successfully." });
    }
    catch {
        res.status(500).json({ message: "Failed to block user." });
    }
}
exports.blockUser = blockUser;
async function unblockUser(req, res) {
    try {
        const user = await User_1.default.findByIdAndUpdate(req.params.id, { status: "active" }, { new: true });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        res.json({ message: "User unblocked successfully." });
    }
    catch {
        res.status(500).json({ message: "Failed to unblock user." });
    }
}
exports.unblockUser = unblockUser;
async function deleteUser(req, res) {
    try {
        const user = await User_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        res.json({ message: "User deleted successfully." });
    }
    catch {
        res.status(500).json({ message: "Failed to delete user." });
    }
}
exports.deleteUser = deleteUser;
