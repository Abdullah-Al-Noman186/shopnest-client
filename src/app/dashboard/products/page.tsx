"use client";

import { useEffect, useState } from "react";
import { Trash2, AlertCircle, Package } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
  image: string;
  seller: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchProducts() {
    setIsLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/products");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setProducts(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.products.map((p: any) => ({
          id: p._id,
          title: p.title,
          category: p.category,
          price: p.price,
          stock: p.stock,
          status: p.status,
          image: p.images?.[0] ?? "",
          seller: p.seller?.name ?? "Unknown",
        }))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load products."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await apiFetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete.");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  if (isLoading) {
    return (
      <section>
        <p className="font-semibold text-green-700">ADMIN</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">All Products</h1>
        <div className="mt-8 grid gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-16 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div>
        <p className="font-semibold text-green-700">ADMIN</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">All Products</h1>
        <p className="mt-1 text-slate-600">
          {products.length} product{products.length !== 1 ? "s" : ""} on ShopNest
        </p>
      </div>

      {error && (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {products.length === 0 && !error ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-green-100 text-green-800">
            <Package size={30} />
          </span>
          <h2 className="text-xl font-bold text-slate-900">No products yet</h2>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-500 md:grid">
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Seller</span>
            <span>Actions</span>
          </div>

          <ul className="divide-y divide-slate-100">
            {products.map((product) => (
              <li key={product.id} className="px-5 py-4">
                <div className="grid items-center gap-3 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
                  {/* Product */}
                  <div className="flex items-center gap-3">
                    <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-green-50 text-2xl">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="size-full object-cover"
                        />
                      ) : (
                        "🛍️"
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {product.title}
                      </p>
                      <p className="text-xs text-slate-500 md:hidden">
                        {product.category} · ${product.price}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <span className="hidden text-sm text-slate-600 md:block">
                    {product.category}
                  </span>

                  {/* Price */}
                  <span className="hidden font-semibold text-slate-900 md:block">
                    ${product.price.toFixed(2)}
                  </span>

                  {/* Stock */}
                  <span
                    className={`hidden text-sm font-medium md:block ${
                      product.stock === 0
                        ? "text-red-600"
                        : product.stock < 5
                        ? "text-amber-600"
                        : "text-slate-700"
                    }`}
                  >
                    {product.stock === 0 ? "Out of stock" : product.stock}
                  </span>

                  {/* Seller */}
                  <span className="hidden truncate text-sm text-slate-600 md:block">
                    {product.seller}
                  </span>

                  {/* Delete */}
                  <div className="flex items-center gap-2">
                    {confirmId === product.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
                        >
                          {deletingId === product.id
                            ? "Deleting..."
                            : "Confirm"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(null)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmId(product.id)}
                        className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}