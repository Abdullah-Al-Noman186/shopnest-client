<<<<<<< HEAD
import { Request } from "express";

export type UserRole = "buyer" | "seller" | "admin";
export type UserStatus = "active" | "blocked";

export interface TokenPayload {
  userId: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}
=======
export type UserRole = "buyer" | "seller" | "admin";
export type UserStatus = "active" | "blocked";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

export type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  seller: { _id: string; name: string; email: string };
  status: "active" | "inactive";
  createdAt: string;
};
>>>>>>> 072d33795fd39776427cb4e3eccc83eca78e8ad4
