import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/current-user";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export const runtime = "nodejs";

// Match exactly what the Product model accepts
const updateProductSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).optional(),
  category: z
    .enum(["Electronics", "Fashion", "Home & Living", "Sports", "Books", "Beauty"])
    .optional(),
  price: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  images: z.array(z.string().url()).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    await connectDB();

    const product = await Product.findById(id)
      .populate("seller", "name email")
      .lean();

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json(
      { message: "Unable to fetch product." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const result = updateProductSchema.safeParse(await request.json());

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { id } = await params;

    await connectDB();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    // "seller" is an ObjectId in the model — compare with toString()
    const isOwner = product.seller.toString() === user.id;
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { message: "You cannot edit this product." },
        { status: 403 }
      );
    }

    Object.assign(product, result.data);
    await product.save();

    return NextResponse.json({ message: "Product updated successfully.", product });
  } catch {
    return NextResponse.json(
      { message: "Unable to update the product." },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    const isOwner = product.seller.toString() === user.id;
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { message: "You cannot delete this product." },
        { status: 403 }
      );
    }

    await product.deleteOne();

    return NextResponse.json({ message: "Product deleted successfully." });
  } catch {
    return NextResponse.json(
      { message: "Unable to delete the product." },
      { status: 500 }
    );
  }
}