import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";
import Product from "@/models/Product";

export const runtime = "nodejs";

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.number().min(0, "Price cannot be negative."),
  category: z.enum(["Electronics", "Fashion", "Home & Living", "Sports", "Books", "Beauty"]),
  stock: z.number().min(0).default(1),
  images: z.array(z.string().url()).default([]),
});

// GET — list all active products (public)
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = { status: "active" };
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };

    const products = await Product.find(query)
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch products." },
      { status: 500 }
    );
  }
}

// POST — create product (seller/admin only)
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || (user.role !== "seller" && user.role !== "admin")) {
      return NextResponse.json(
        { message: "Only sellers can add products." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.create({
      ...result.data,
      seller: user.id,
    });

    return NextResponse.json(
      { message: "Product created successfully.", product },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to create product." },
      { status: 500 }
    );
  }
}