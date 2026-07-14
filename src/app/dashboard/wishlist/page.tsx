

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getWishlist() {
  try {
    const res = await fetch(`${API_URL}/api/wishlist`, {
      cache: "no-store",
      credentials: "include",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    return data.items;
  } catch {
    return [];
  }
}

export default async function WishlistPage() {
  const items = await getWishlist();

  return (
    <section className="container mx-auto px-6 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Heart className="text-pink-500" size={30} />
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-slate-500">
            {items.length} item{items.length !== 1 && "s"}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center">
          <Heart
            size={60}
            className="mx-auto mb-4 text-slate-300"
          />

          <h2 className="text-2xl font-semibold">
            Your wishlist is empty
          </h2>

          <p className="mt-2 text-slate-500">
            Save products you love and come back later.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-block rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item: any) => {
            const product = item.product;

            return (
              <div
                key={item._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="relative aspect-square bg-slate-100">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-7xl">
                      🛍️
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-5">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {product.category}
                  </span>

                  <h2 className="line-clamp-2 text-xl font-bold">
                    {product.title}
                  </h2>

                  <p className="line-clamp-2 text-sm text-slate-500">
                    {product.description}
                  </p>

                  <p className="text-2xl font-bold text-green-700">
                    ${product.price}
                  </p>

                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/products/${product._id}`}
                      className="flex-1 rounded-xl bg-green-700 py-2 text-center font-semibold text-white hover:bg-green-800"
                    >
                      View
                    </Link>

                    <button className="rounded-xl border border-green-600 px-4 text-green-700 hover:bg-green-50">
                      <ShoppingCart size={20} />
                    </button>

                    <button className="rounded-xl border border-red-500 px-4 text-red-600 hover:bg-red-50">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}