"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, Package, ShoppingCart, Clock } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Stats = {
  totalRevenue: number;
  totalOrders: number;
  delivered: number;
  pending: number;
  monthlyRevenue: { month: string; revenue: number }[];
  topProducts: { title: string; sold: number; revenue: number }[];
};

export default function SellerStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await apiFetch("/api/orders/seller-stats");
        const data = await res.json();
        if (res.ok) setStats(data);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <section>
        <p className="font-semibold text-green-700">SELLER</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Sales Statistics
        </h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-28 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-green-100 text-green-800",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-800",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      icon: Package,
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "bg-amber-100 text-amber-800",
    },
  ];

  return (
    <section>
      <p className="font-semibold text-green-700">SELLER</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">
        Sales Statistics
      </h1>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {s.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {s.value}
                  </p>
                </div>
                <span className={`rounded-xl p-3 ${s.color}`}>
                  <Icon size={22} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Revenue Chart */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 font-bold text-slate-900">
          Monthly Revenue (Last 6 Months)
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={stats.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, "Revenue"]} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#15803d"
              strokeWidth={2.5}
              dot={{ fill: "#15803d", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products Chart */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 font-bold text-slate-900">Top Products by Revenue</h2>
        {stats.topProducts.length === 0 ? (
          <p className="py-8 text-center text-slate-500">
            No sales data yet.
          </p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="title"
                  tick={{ fontSize: 11 }}
                  stroke="#94a3b8"
                  interval={0}
                  tickFormatter={(v: string) =>
                    v.length > 14 ? v.slice(0, 14) + "…" : v
                  }
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  formatter={(v: number) => [`$${v.toFixed(2)}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#15803d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Table */}
            <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Units Sold</th>
                    <th className="px-4 py-3">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.topProducts.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {p.title}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{p.sold}</td>
                      <td className="px-4 py-3 font-semibold text-green-800">
                        ${p.revenue.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}