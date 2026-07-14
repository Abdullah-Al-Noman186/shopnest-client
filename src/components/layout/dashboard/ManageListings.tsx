"use client";

import Link from "next/link";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
};

export default function ManageListings() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadProducts() {
    const response = await fetch("/api/products/mine");
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message);
    } else {
      setProducts(data.products);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function deleteProduct(id: string) {
    if (!window.confirm("Permanently delete this product?")) return;

    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== id)
    );
  }

  if (isLoading) {
    return (
      <div className="grid place-items-center py-16 text-green-700">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (message) {
    return <p className="rounded-xl bg-red-50 p-4 text-red-700">{message}</p>;
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-slate-900">No listings yet</h2>
        <p className="mt-2 text-slate-600">
          Add your first product to begin selling on ShopNest.
        </p>
        <Link
          href="/dashboard/products/add"
          className="mt-6 inline-block rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
        >
          Add Product
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="w-full min-w-175 text-left">
        <thead className="border-b border-slate-200 bg-slate-50 text-sm text-slate-500">
          <tr>
            <th className="p-4">Product</th>
            <th className="p-4">Category</th>
            <th className="p-4">Price</th>
            <th className="p-4">Stock</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-slate-100 last:border-0">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="size-12 rounded-lg object-cover"
                  />
                  <span className="font-semibold text-slate-900">{product.title}</span>
                </div>
              </td>
              <td className="p-4 text-slate-600">{product.category}</td>
              <td className="p-4 font-semibold text-green-800">
                ${product.price.toFixed(2)}
              </td>
              <td className="p-4 text-slate-600">{product.stock}</td>
              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-green-800 hover:bg-green-50"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteProduct(product.id)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    aria-label={`Delete ${product.title}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}