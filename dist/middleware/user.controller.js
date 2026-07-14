"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.unblockUser = exports.blockUser = exports.changePassword = exports.updateProfile = exports.getAllUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
// ===============================
// Get All Users (Admin)
// ===============================
async function getAllUsers(_req, res) {
    try {
        const users = await User_1.default.find()
            .select("-password")
            .sort({ createdAt: -1 })
            .lean();
        res.json({ users });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to fetch users.",
        });
    }
}
exports.getAllUsers = getAllUsers;
// ===============================
// Update Profile
// ===============================
async function updateProfile(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "Unauthorized.",
            });
            return;
        }
        const { name, email, avatar } = req.body;
        // Check duplicate email
        if (email) {
            const existing = await User_1.default.findOne({
                email,
                _id: { $ne: req.user.userId },
            });
            if (existing) {
                res.status(409).json({
                    message: "Email already exists.",
                });
                return;
            }
        }
        const user = await User_1.default.findByIdAndUpdate(req.user.userId, {
            ...(name !== undefined && { name }),
            ...(email !== undefined && { email }),
            ...(avatar !== undefined && { avatar }),
        }, {
            new: true,
            runValidators: true,
        }).select("-password");
        if (!user) {
            res.status(404).json({
                message: "User not found.",
            });
            return;
        }
        res.json({
            message: "Profile updated successfully.",
            user,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to update profile.",
        });
    }
}
exports.updateProfile = updateProfile;
// ===============================
// Change Password
// ===============================
async function changePassword(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "Unauthorized.",
            });
            return;
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({
                message: "Current password and new password are required.",
            });
            return;
        }
        const user = await User_1.default.findById(req.user.userId).select("+password");
        if (!user) {
            res.status(404).json({
                message: "User not found.",
            });
            return;
        }
        const matched = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!matched) {
            res.status(400).json({
                message: "Current password is incorrect.",
            });
            return;
        }
        user.password = await bcryptjs_1.default.hash(newPassword, 12);
        await user.save();
        res.json({
            message: "Password changed successfully.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to change password.",
        });
    }
}
exports.changePassword = changePassword;
// ===============================
// Block User
// ===============================
async function blockUser(req, res) {
    try {
        const user = await User_1.default.findByIdAndUpdate(req.params.id, {
            status: "blocked",
        }, {
            new: true,
        });
        if (!user) {
            res.status(404).json({
                message: "User not found.",
            });
            return;
        }
        res.json({
            message: "User blocked successfully.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to block user.",
        });
    }
}
exports.blockUser = blockUser;
// ===============================
// Unblock User
// ===============================
async function unblockUser(req, res) {
    try {
        const user = await User_1.default.findByIdAndUpdate(req.params.id, {
            status: "active",
        }, {
            new: true,
        });
        if (!user) {
            res.status(404).json({
                message: "User not found.",
            });
            return;
        }
        res.json({
            message: "User unblocked successfully.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to unblock user.",
        });
    }
}
exports.unblockUser = unblockUser;
// ===============================
// Delete User
// ===============================
async function deleteUser(req, res) {
    try {
        const user = await User_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({
                message: "User not found.",
            });
            return;
        }
        res.json({
            message: "User deleted successfully.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to delete user.",
        });
    }
}
exports.deleteUser = deleteUser;
