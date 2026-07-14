import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (user.role !== "seller" && user.role !== "admin") {
      return NextResponse.json(
        { message: "Only sellers and admins can manage listings." },
        { status: 403 }
      );
    }

    await connectDB();

    // "seller" is the field name in the Product model (not "sellerId")
    const products = await Product.find({ seller: user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      products: products.map((product) => ({
        id: product._id.toString(),
        title: product.title,
        category: product.category,
        price: product.price,
        stock: product.stock,
        status: product.status,
        // model stores "images" as an array — return the first one as preview
        image: product.images?.[0] ?? "",
        createdAt: product.createdAt,
      })),
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to load your listings." },
      { status: 500 }
    );
  }
}