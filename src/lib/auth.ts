import jwt from "jsonwebtoken";
import type { UserRole } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please add JWT_SECRET to your .env.local file.");
}

export type TokenPayload = {
  userId: string;
  role: UserRole;
};

export function createToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}