import { Request, Response } from "express";
import User from "../models/User";
console.log("LOADED:", __filename);

export async function getAllUsers(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
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
  } catch {
    res.status(500).json({ message: "Failed to fetch users." });
  }
}

export async function blockUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "blocked" },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.json({ message: "User blocked successfully." });
  } catch {
    res.status(500).json({ message: "Failed to block user." });
  }
}

export async function unblockUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.json({ message: "User unblocked successfully." });
  } catch {
    res.status(500).json({ message: "Failed to unblock user." });
  }
}

export async function deleteUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.json({ message: "User deleted successfully." });
  } catch {
    res.status(500).json({ message: "Failed to delete user." });
  }
}