"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Admin only
router.get("/", auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)("admin"), user_controller_1.getAllUsers);
router.patch("/:id/block", auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)("admin"), user_controller_1.blockUser);
router.patch("/:id/unblock", auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)("admin"), user_controller_1.unblockUser);
router.delete("/:id", auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)("admin"), user_controller_1.deleteUser);
exports.default = router;
