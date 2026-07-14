"use client";

import { useEffect, useState } from "react";
import { Package, AlertCircle, ChevronDown } from "lucide-react";
import { apiFetch } from "@/lib/api";

type OrderItem = {
  title: string;
  image: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  buyer: { name: string; email: string };
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const NEXT_STATUSES: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await apiFetch("/api/orders/seller-orders");
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

  async function handleStatusUpdate(orderId: string, status: string) {
    setUpdatingId(orderId);
    try {
      const res = await apiFetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: status as Order["status"] } : o
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (isLoading) {
    return (
      <section>
        <p className="font-semibold text-green-700">SELLER</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Orders Received
        </h1>
        <div className="mt-8 grid gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-24 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <p className="font-semibold text-green-700">SELLER</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">
        Orders Received
      </h1>
      <p className="mt-1 text-slate-600">
        {orders.length} order{orders.length !== 1 ? "s" : ""}
      </p>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {orders.length === 0 && !error ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-green-100 text-green-800">
            <Package size={30} />
          </span>
          <h2 className="text-xl font-bold text-slate-900">No orders yet</h2>
          <p className="max-w-sm text-slate-600">
            Orders will appear here when buyers purchase your products.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
            >
              {/* Order header */}
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

                  {/* Status updater */}
                  {NEXT_STATUSES[order.status].length > 0 && (
                    <select
                      value=""
                      disabled={updatingId === order._id}
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value)
                      }
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-green-700 disabled:opacity-50"
                    >
                      <option value="" disabled>
                        Update status
                      </option>
                      {NEXT_STATUSES[order.status].map((s) => (
                        <option key={s} value={s}>
                          Mark as {s}
                        </option>
                      ))}
                    </select>
                  )}

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

              {/* Buyer info always visible */}
              <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-sm">
                <span className="text-slate-500">Buyer: </span>
                <span className="font-medium text-slate-800">
                  {order.buyer.name}
                </span>
                <span className="ml-2 text-slate-400">{order.buyer.email}</span>
              </div>

              {/* Expanded details */}
              {expandedId === order._id && (
                <div className="border-t border-slate-100 px-5 py-4">
                  {/* Items */}
                  <h3 className="mb-3 text-sm font-semibold text-slate-700">
                    Items
                  </h3>
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
                        <span className="font-semibold text-slate-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Shipping address */}
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <h3 className="mb-2 text-sm font-semibold text-slate-700">
                      Shipping Address
                    </h3>
                    <p className="text-sm text-slate-600">
                      {order.shippingAddress.fullName}
                      <br />
                      {order.shippingAddress.address}
                      <br />
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.postalCode}
                      <br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}