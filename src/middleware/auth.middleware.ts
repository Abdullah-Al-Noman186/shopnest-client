import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AuthRequest, TokenPayload, UserRole } from "../types";

export function protect(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = req.cookies?.shopnest_token;

    if (!token) {
      res.status(401).json({ message: "Not authenticated. Please log in." });
      return;
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    console.log("JWT Payload:", payload);

    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired session." });
  }
}

export function restrictTo(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "You do not have permission." });
      return;
    }
    next();
  };
}