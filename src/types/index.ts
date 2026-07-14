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