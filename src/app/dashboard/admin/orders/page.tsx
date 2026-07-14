"use client";

import { useEffect, useState } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Order = {
  _id: string;
  buyer: { name: string; email: string };
  seller: { name: string; email: string };
  items: { title: string; price: number; quantity: number; image: string }[];
  totalAmount: number;
  status: string;
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await apiFetch("/api/orders");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setOrders(data.orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filtered =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  if (isLoading) {
    return (
      <section>
        <p className="font-semibold text-green-700">ADMIN</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">All Orders</h1>
        <div className="mt-8 grid gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-20 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <p className="font-semibold text-green-700">ADMIN</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">All Orders</h1>
      <p className="mt-1 text-slate-600">
        {orders.length} total order{orders.length !== 1 ? "s" : ""}
      </p>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="mt-5 flex flex-wrap gap-2">
        {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map(
          (s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${
                statusFilter === s
                  ? "bg-green-700 text-white"
                  : "border border-slate-300 text-slate-600 hover:border-green-700 hover:text-green-700"
              }`}
            >
              {s}
            </button>
          )
        )}
      </div>

      <div className="mt-5 grid gap-4">
        {filtered.map((order) => (
          <div
            key={order._id}
            className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-slate-400">
                  #{order._id.slice(-8).toUpperCase()}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                    STATUS_COLORS[order.status]
                  }`}
                >
                  {order.status}
                </span>
                <span className="text-sm text-slate-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-green-800">
                  ${order.totalAmount.toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(
                      expandedId === order._id ? null : order._id
                    )
                  }
                  className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      expandedId === order._id ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-sm">
              <span className="text-slate-500">Buyer: </span>
              <span className="font-medium">{order.buyer?.name}</span>
              <span className="mx-3 text-slate-300">|</span>
              <span className="text-slate-500">Seller: </span>
              <span className="font-medium">{order.seller?.name}</span>
            </div>

            {expandedId === order._id && (
              <div className="border-t border-slate-100 px-5 py-4">
                <ul className="grid gap-3">
                  {order.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-green-50 text-xl">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="size-full object-cover"
                          />
                        ) : (
                          "🛍️"
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}