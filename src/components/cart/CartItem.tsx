"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  updateCart,
  removeCart,
} from "@/lib/cart";

type Props = {
  item: any;
};

export default function CartItem({ item }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function increase() {
    setLoading(true);

    await updateCart(item._id, item.quantity + 1);

    setLoading(false);
    router.refresh();
  }

  async function decrease() {
    if (item.quantity === 1) return;

    setLoading(true);

    await updateCart(item._id, item.quantity - 1);

    setLoading(false);
    router.refresh();
  }

  async function remove() {
    setLoading(true);

    await removeCart(item._id);

    setLoading(false);
    router.refresh();
  }

  return (
    <div className="rounded-xl border p-5">
      <div className="flex justify-between">

        <div>
          <h2 className="text-xl font-bold">
            {item.product.title}
          </h2>

          <p className="text-green-700 font-semibold">
            ${item.product.price}
          </p>
        </div>

        <button
          onClick={remove}
          disabled={loading}
          className="text-red-600"
        >
          <Trash2 />
        </button>
      </div>

      <div className="mt-5 flex items-center gap-3">

        <button
          onClick={decrease}
          className="rounded-lg border p-2"
        >
          <Minus size={18}/>
        </button>

        <span className="text-lg font-bold">
          {item.quantity}
        </span>

        <button
          onClick={increase}
          className="rounded-lg border p-2"
        >
          <Plus size={18}/>
        </button>

      </div>

      <div className="mt-5 text-xl font-bold text-green-700">
        $
        {(item.product.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
}