import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import type { Product } from "@/types";
import ProductActions from "@/components/product/ProductActions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getProduct(id: string) {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    const p: Product = data.product;

    return {
      id: p._id,
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      stock: p.stock,
      images: p.images ?? [],
      seller: p.seller?.name ?? "ShopNest Seller",
    };
  } catch {
    return null;
  }
}

type Props = { params: Promise<{ id: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <section className="container-page py-14">
      {/* Back */}
      <Link
        href="/products"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-green-700"
      >
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Images */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square overflow-hidden rounded-2xl bg-green-50">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="size-full object-cover"
              />
            ) : (
              <div className="grid size-full place-items-center text-7xl">
                🛍️
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="size-20 shrink-0 overflow-hidden rounded-xl border border-slate-200"
                >
                  <img
                    src={img}
                    alt={`${product.title} ${i + 1}`}
                    className="size-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
            {product.category}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            {product.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sold by {product.seller}
          </p>

          <p className="mt-6 text-4xl font-bold text-green-800">
            ${product.price.toFixed(2)}
          </p>

          {/* Stock */}
          <div className="mt-4 flex items-center gap-2">
            <Package size={16} className="text-slate-400" />
            {product.stock === 0 ? (
              <span className="text-sm font-medium text-red-600">
                Out of stock
              </span>
            ) : product.stock < 5 ? (
              <span className="text-sm font-medium text-amber-600">
                Only {product.stock} left
              </span>
            ) : (
              <span className="text-sm font-medium text-green-700">
                In stock ({product.stock} available)
              </span>
            )}
          </div>

          <p className="mt-6 leading-7 text-slate-600">
            {product.description}
          </p>

          {/* Actions */}
<ProductActions
  productId={product.id}
  stock={product.stock}
/>

<div className="mt-4">
  <Link
    href="/products"
    className="block rounded-xl border border-slate-300 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-100"
  >
    Continue Shopping
  </Link>
</div>

          {/* Meta */}
          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <h2 className="font-semibold text-slate-900">Product Details</h2>
            <dl className="mt-3 grid gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Category</dt>
                <dd className="font-medium text-slate-900">
                  {product.category}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Availability</dt>
                <dd className="font-medium text-slate-900">
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Seller</dt>
                <dd className="font-medium text-slate-900">
                  {product.seller}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}