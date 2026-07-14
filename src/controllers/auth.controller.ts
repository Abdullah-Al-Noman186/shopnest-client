import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User";
import type { TokenPayload } from "../types";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["buyer", "seller"]).default("buyer"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required."),
});

function createToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: result.error.issues[0].message });
      return;
    }

    const { name, email, password, role } = result.data;

    const existing = await User.findOne({ email });
    if (existing) {
      res
        .status(409)
        .json({ message: "An account with this email already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashedPassword, role });

    res
      .status(201)
      .json({ message: "Account created successfully. Please log in." });
  } catch {
    res.status(500).json({ message: "Unable to create account." });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: result.error.issues[0].message });
      return;
    }

    const { email, password } = result.data;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
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
  } catch {
    res.status(500).json({ message: "Unable to log in." });
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.cookie("shopnest_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  res.json({ message: "Logged out successfully." });
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as import("../types").AuthRequest;
    const user = await User.findById(authReq.user?.userId).lean();
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
  } catch {
    res.status(500).json({ message: "Unable to fetch user." });
  }
}