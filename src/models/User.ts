import { Model, Schema, model, models } from "mongoose";
<<<<<<< HEAD
import type { UserRole, UserStatus } from "../types";
=======

export type UserRole = "buyer" | "seller" | "admin";
export type UserStatus = "active" | "blocked";
>>>>>>> 072d33795fd39776427cb4e3eccc83eca78e8ad4

export interface IUser {
  name: string;
  email: string;
  password: string;
<<<<<<< HEAD
  avatar: string;
=======
  avatar?: string;
>>>>>>> 072d33795fd39776427cb4e3eccc83eca78e8ad4
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
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
  },
  { timestamps: true }
);

const User: Model<IUser> = models.User || model<IUser>("User", userSchema);
<<<<<<< HEAD
=======

>>>>>>> 072d33795fd39776427cb4e3eccc83eca78e8ad4
export default User;