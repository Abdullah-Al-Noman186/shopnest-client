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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type AdminStats = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalSellers: number;
  totalBuyers: number;
  monthlyRevenue: { month: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  usersByRole: { role: string; count: number }[];
};

const PIE_COLORS = ["#15803d", "#1d4ed8", "#b45309", "#dc2626", "#7c3aed"];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await apiFetch("/api/orders/admin-stats");
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
        <p className="font-semibold text-green-700">ADMIN</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Analytics</h1>
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
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-purple-100 text-purple-800",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-amber-100 text-amber-800",
    },
  ];

  return (
    <section>
      <p className="font-semibold text-green-700">ADMIN</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">
        Analytics Dashboard
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

      {/* Charts row */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Monthly Revenue */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 font-bold text-slate-900">
            Monthly Revenue
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={stats.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                formatter={(v: number) => [`$${v.toFixed(2)}`, "Revenue"]}
              />
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

        {/* Orders by status */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 font-bold text-slate-900">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.ordersByStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="status"
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="count" fill="#15803d" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Users by role pie */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 font-bold text-slate-900">Users by Role</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={stats.usersByRole}
                dataKey="count"
                nameKey="role"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ role, count }) => `${role}: ${count}`}
              >
                {stats.usersByRole.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Quick summary */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 font-bold text-slate-900">Platform Summary</h2>
          <dl className="grid gap-4">
            {[
              { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}` },
              { label: "Total Orders", value: stats.totalOrders },
              { label: "Total Products", value: stats.totalProducts },
              { label: "Buyers", value: stats.totalBuyers },
              { label: "Sellers", value: stats.totalSellers },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
              >
                <dt className="text-sm text-slate-500">{item.label}</dt>
                <dd className="font-bold text-slate-900">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}