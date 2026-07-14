"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { apiFetch } from "@/lib/api";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Sports",
  "Books",
  "Beauty",
];

export default function AddProductPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const body = {
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      price: Number(formData.get("price")),
      category: String(formData.get("category")),
      stock: Number(formData.get("stock")),
      images: String(formData.get("images"))
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

  // replace the fetch call inside handleSubmit with:
const res = await apiFetch("/api/products", {
  method: "POST",
  body: JSON.stringify(body),
});

    const data = await res.json();
    setIsLoading(false);

    if (!res.ok) {
      setMessage(data.message);
      return;
    }

    setIsSuccess(true);
    setMessage("Product listed successfully!");
    setTimeout(() => router.push("/dashboard/products/manage"), 1500);
  }

  return (
    <section className="max-w-2xl">
      <p className="font-semibold text-green-700">SELLER</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Add New Product</h1>
      <p className="mt-2 text-slate-600">
        Fill in the details below to list a product on ShopNest.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200"
      >
        <div className="grid gap-5">
          {/* Title */}
          <label className="grid gap-2">
            <span className="font-medium text-slate-700">
              Product Title <span className="text-red-500">*</span>
            </span>
            <input
              name="title"
              required
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
            />
          </label>

          {/* Description */}
          <label className="grid gap-2">
            <span className="font-medium text-slate-700">
              Description <span className="text-red-500">*</span>
            </span>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Describe your product in detail..."
              className="resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
            />
          </label>

          {/* Price + Stock */}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="font-medium text-slate-700">
                Price (USD) <span className="text-red-500">*</span>
              </span>
              <input
                name="price"
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-medium text-slate-700">
                Stock Quantity <span className="text-red-500">*</span>
              </span>
              <input
                name="stock"
                required
                type="number"
                min="0"
                defaultValue="1"
                className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
              />
            </label>
          </div>

          {/* Category */}
          <label className="grid gap-2">
            <span className="font-medium text-slate-700">
              Category <span className="text-red-500">*</span>
            </span>
            <select
              name="category"
              required
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          {/* Image URLs */}
          <label className="grid gap-2">
            <span className="font-medium text-slate-700">Image URLs</span>
            <input
              name="images"
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
            />
            <span className="text-xs text-slate-500">
              Separate multiple URLs with a comma.
            </span>
          </label>

          {/* Feedback */}
          {message && (
            <p
              className={`rounded-lg p-3 text-sm font-medium ${
                isSuccess
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-xl bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Publishing..." : "Publish Product"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}