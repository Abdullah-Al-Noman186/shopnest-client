import { cookies } from "next/headers";
import type { UserRole } from "@/types";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: "active" | "blocked";
  createdAt: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("shopnest_token")?.value;

    if (!token) return null;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/me`,
      {
        headers: {
          Cookie: `shopnest_token=${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}