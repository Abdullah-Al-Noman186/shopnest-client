import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import type { AuthRequest } from "../types";

// ===============================
// Get All Users (Admin)
// ===============================
export async function getAllUsers(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch users.",
    });
  }
}

// ===============================
// Update Profile
// ===============================
export async function updateProfile(
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

    const { name, email, avatar } = req.body;

    // Check duplicate email
    if (email) {
      const existing = await User.findOne({
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

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(avatar !== undefined && { avatar }),
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

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
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to update profile.",
    });
  }
}

// ===============================
// Change Password
// ===============================
export async function changePassword(
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

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        message: "Current password and new password are required.",
      });
      return;
    }

    const user = await User.findById(req.user.userId).select("+password");

    if (!user) {
      res.status(404).json({
        message: "User not found.",
      });
      return;
    }

    const matched = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!matched) {
      res.status(400).json({
        message: "Current password is incorrect.",
      });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 12);

    await user.save();

    res.json({
      message: "Password changed successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to change password.",
    });
  }
}

// ===============================
// Block User
// ===============================
export async function blockUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: "blocked",
      },
      {
        new: true,
      }
    );

    if (!user) {
      res.status(404).json({
        message: "User not found.",
      });
      return;
    }

    res.json({
      message: "User blocked successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to block user.",
    });
  }
}

// ===============================
// Unblock User
// ===============================
export async function unblockUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: "active",
      },
      {
        new: true,
      }
    );

    if (!user) {
      res.status(404).json({
        message: "User not found.",
      });
      return;
    }

    res.json({
      message: "User unblocked successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to unblock user.",
    });
  }
}

// ===============================
// Delete User
// ===============================
export async function deleteUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({
        message: "User not found.",
      });
      return;
    }

    res.json({
      message: "User deleted successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to delete user.",
    });
  }
}