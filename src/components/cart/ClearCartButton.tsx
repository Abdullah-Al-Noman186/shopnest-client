"use client";

import { useRouter } from "next/navigation";
import { clearCart } from "@/lib/cart";

export default function ClearCartButton() {
  const router = useRouter();

  async function handleClear() {
    if (!confirm("Clear your cart?")) return;

    await clearCart();

    router.refresh();
  }

  return (
    <button
      onClick={handleClear}
      className="rounded-xl bg-red-600 px-5 py-3 text-white"
    >
      Clear Cart
    </button>
  );
}