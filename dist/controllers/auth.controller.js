"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const User_1 = __importDefault(require("../models/User"));
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters."),
    email: zod_1.z.string().email("Enter a valid email."),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters."),
    role: zod_1.z.enum(["buyer", "seller"]).default("buyer"),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1, "Password is required."),
});
function createToken(payload) {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}
async function register(req, res) {
    try {
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: result.error.issues[0].message });
            return;
        }
        const { name, email, password, role } = result.data;
        const existing = await User_1.default.findOne({ email });
        if (existing) {
            res
                .status(409)
                .json({ message: "An account with this email already exists." });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        await User_1.default.create({ name, email, password: hashedPassword, role });
        res
            .status(201)
            .json({ message: "Account created successfully. Please log in." });
    }
    catch {
        res.status(500).json({ message: "Unable to create account." });
    }
}
exports.register = register;
async function login(req, res) {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: result.error.issues[0].message });
            return;
        }
        const { email, password } = result.data;
        const user = await User_1.default.findOne({ email }).select("+password");
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            res.status(401).json({ message: "Incorrect email or password." });
            return;
        }
        if (user.status === "blocked") {
            res
                .status(403)
                .json({ message: "Your account has been blocked. Contact support." });
            return;
        }
        const token = createToken({
            userId: user._id.toString(),
            role: user.role,
        });
        res.cookie("shopnest_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        res.json({
            message: "Login successful.",
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch {
        res.status(500).json({ message: "Unable to log in." });
    }
}
exports.login = login;
async function logout(_req, res) {
    res.cookie("shopnest_token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });
    res.json({ message: "Logged out successfully." });
}
exports.logout = logout;
async function getMe(req, res) {
    try {
        const authReq = req;
        const user = await User_1.default.findById(authReq.user?.userId).lean();
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        res.json({
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt,
            },
        });
    }
    catch {
        res.status(500).json({ message: "Unable to fetch user." });
    }
}
exports.getMe = getMe;
