import Link from "next/link";
import { ShoppingBag, Search } from "lucide-react";

const CATEGORIES = [
  "All",
  "Electronics",
  "Fashion",
  "Home & Living",
  "Sports",
  "Books",
  "Beauty",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type RawProduct = {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  seller: { name: string } | null;
  status: string;
};

async function getProducts(category?: string, search?: string) {
  try {
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category);
    if (search) params.set("search", search);

    const url = `${API_URL}/api/products${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();

    if (!data.products || !Array.isArray(data.products)) return [];

    return data.products.map((p: RawProduct) => ({
      id: p._id,
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      stock: p.stock,
      image: Array.isArray(p.images) ? p.images[0] ?? "" : "",
      seller: p.seller?.name ?? "ShopNest Seller",
    }));
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return [];
  }
}

type Props = {
  searchParams: Promise<{ category?: string; search?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const { category, search } = await searchParams;
  const products = await getProducts(category, search);

  return (
    <section className="container-page py-14">
      {/* Header */}
      <div className="mb-10">
        <p className="font-semibold text-green-700">SHOP</p>
        <h1 className="mt-1 text-4xl font-bold text-slate-900">
          Explore Products
        </h1>
        <p className="mt-2 text-slate-600">
          {products.length} product{products.length !== 1 ? "s" : ""} available
          {search ? ` for "${search}"` : ""}
          {category && category !== "All" ? ` in ${category}` : ""}
        </p>
      </div>

      {/* Search + filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <form method="GET" className="relative flex-1">
          {category && category !== "All" && (
            <input type="hidden" name="category" value={category} />
          )}
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            name="search"
            defaultValue={search ?? ""}
            placeholder="Search products..."
            className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-green-700"
          />
        </form>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive =
              cat === "All"
                ? !category || category === "All"
                : category === cat;

            const params = new URLSearchParams();
            if (cat !== "All") params.set("category", cat);
            if (search) params.set("search", search);
            const href = `/products${
              params.toString() ? `?${params.toString()}` : ""
            }`;

            return (
              <Link
                key={cat}
                href={href}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-green-700 text-white"
                    : "border border-slate-300 text-slate-600 hover:border-green-700 hover:text-green-700"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-green-100 text-green-800">
            <ShoppingBag size={30} />
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            No products found
          </h2>
          <p className="max-w-sm text-slate-600">
            {search
              ? `No results for "${search}". Try a different keyword.`
              : "No products in this category yet. Check back soon."}
          </p>
          <Link
            href="/products"
            className="mt-2 rounded-xl bg-green-700 px-5 py-2.5 font-semibold text-white hover:bg-green-800"
          >
            View all products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-green-50">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="size-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="grid size-full place-items-center text-5xl">
                    🛍️
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 grid place-items-center bg-black/40">
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-900">
                      Out of stock
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                  {product.category}
                </p>
                <h2 className="mt-1 line-clamp-2 font-bold text-slate-900">
                  {product.title}
                </h2>
                <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-500">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-bold text-green-800">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400">
                    by {product.seller}
                  </span>
                </div>
                <Link
                  href={`/products/${product.id}`}
                  className={`mt-4 block rounded-xl py-2.5 text-center text-sm font-semibold transition ${
                    product.stock === 0
                      ? "cursor-not-allowed border border-slate-200 text-slate-400"
                      : "border border-green-700 text-green-800 hover:bg-green-700 hover:text-white"
                  }`}
                >
                  {product.stock === 0 ? "Unavailable" : "View Product"}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}