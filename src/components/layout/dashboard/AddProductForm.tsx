"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Sports",
  "Books",
  "Beauty",
];

export default function AddProductForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    const data = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    router.push("/dashboard/products/manage");
    router.refresh();
  }

  const inputClass =
    "rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100";

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 font-medium text-slate-700">
          Product title
          <input name="title" required className={inputClass} />
        </label>

        <label className="grid gap-2 font-medium text-slate-700">
          Category
          <select name="category" required defaultValue="" className={inputClass}>
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2 font-medium text-slate-700">
        Short description <span className="font-normal text-slate-500">(maximum 150 characters)</span>
        <input name="shortDescription" required maxLength={150} className={inputClass} />
      </label>

      <label className="grid gap-2 font-medium text-slate-700">
        Full description
        <textarea name="fullDescription" required rows={5} className={`${inputClass} resize-none`} />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 font-medium text-slate-700">
          Price (USD)
          <input name="price" required type="number" min="0" step="0.01" className={inputClass} />
        </label>

        <label className="grid gap-2 font-medium text-slate-700">
          Stock quantity
          <input name="stock" required type="number" min="0" step="1" className={inputClass} />
        </label>
      </div>

      <label className="grid gap-2 font-medium text-slate-700">
        Product image URL
        <input name="imageUrl" required type="url" placeholder="https://example.com/product.jpg" className={inputClass} />
      </label>

      {message && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{message}</p>
      )}

      <button
        disabled={isLoading}
        className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Publishing product..." : "Publish Product"}
      </button>
    </form>
  );
}