"use client";

import { useRouter } from "next/navigation";
import { Heart, ShoppingCart } from "lucide-react";
import { addToWishlist } from "@/lib/wishlist";
import { addToCart } from "@/lib/cart";
import { useState } from "react";

type Props = {
  productId: string;
  stock: number;
};

export default function ProductActions({
  productId,
  stock,
}: Props) {
  const router = useRouter();

  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  async function handleCart() {
    setLoadingCart(true);

    const res = await addToCart(productId);

    setLoadingCart(false);

    if (!res.ok) {
      const data = await res.json();
      alert(data.message);
      return;
    }

    router.push("/dashboard/cart");
    router.refresh();
  }

  async function handleWishlist() {
    setLoadingWishlist(true);

    const res = await addToWishlist(productId);

    setLoadingWishlist(false);

    if (!res.ok) {
      const data = await res.json();
      alert(data.message);
      return;
    }

    router.push("/dashboard/wishlist");
    router.refresh();
  }

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <button
        onClick={handleCart}
        disabled={stock === 0 || loadingCart}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
      >
        <ShoppingCart size={20} />
        {loadingCart ? "Adding..." : "Add to Cart"}
      </button>

      <button
        onClick={handleWishlist}
        disabled={loadingWishlist}
        className="flex items-center justify-center gap-2 rounded-xl border border-pink-500 px-6 py-3 text-pink-600 hover:bg-pink-50"
      >
        <Heart size={20} />
        Wishlist
      </button>
    </div>
  );
}