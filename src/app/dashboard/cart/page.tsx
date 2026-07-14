import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import CartItem from "@/components/cart/CartItem";
import ClearCartButton from "@/components/cart/ClearCartButton";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getCart() {
  const res = await fetch(`${API_URL}/api/cart`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    return {
      items: [],
      total: 0,
    };
  }

  return res.json();
}

export default async function CartPage() {
  const { items, total } = await getCart();

  return (
    <section className="container mx-auto px-6 py-10">
      <h1 className="mb-8 flex items-center gap-2 text-3xl font-bold">
        <ShoppingCart />
        My Cart
      </h1>

      {items.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="text-2xl font-semibold">
            Your cart is empty
          </h2>

          <Link
            href="/products"
            className="mt-5 inline-block rounded-lg bg-green-700 px-6 py-3 text-white"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-5">
  {items.map((item: any) => (
    <CartItem
      key={item._id}
      item={item}
    />
  ))}
</div>

          <div className="mt-8 rounded-xl bg-slate-100 p-6">

<h2 className="text-2xl font-bold">
Total: ${total.toFixed(2)}
</h2>

<div className="mt-5 flex gap-4">

<ClearCartButton />

<button
className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white"
>
Checkout
</button>

</div>

</div>
        </>
      )}
    </section>
  );
}