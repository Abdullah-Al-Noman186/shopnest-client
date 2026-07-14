"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  CircleUserRound,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  PlusCircle,
  ShoppingBag,
  ShoppingCart,
  Users,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { CurrentUser } from "@/lib/current-user";

type Props = {
  user: CurrentUser;
};

export default function DashboardSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = user.role === "admin";
  const canManageProducts = user.role === "seller" || isAdmin;

  const links = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      visible: true,
    },
    {
      href: "/dashboard/profile",
      label: "My Profile",
      icon: CircleUserRound,
      visible: true,
    },
    {
      href: "/dashboard/products/add",
      label: "Add Product",
      icon: PlusCircle,
      visible: canManageProducts,
    },
    {
      href: "/dashboard/products/manage",
      label: "My Listings",
      icon: Package,
      visible: canManageProducts,
    },
    {
      href: "/dashboard/seller/orders",
      label: "Orders Received",
      icon: ShoppingCart,
      visible: canManageProducts,
    },
    {
      href: "/dashboard/seller/stats",
      label: "Sales Stats",
      icon: BarChart3,
      visible: canManageProducts,
    },
    {
      href: "/dashboard/admin/products",
      label: "All Products",
      icon: ShoppingBag,
      visible: isAdmin,
    },
    {
      href: "/dashboard/admin/users",
      label: "All Users",
      icon: Users,
      visible: isAdmin,
    },
    {
      href: "/dashboard/admin/orders",
      label: "All Orders",
      icon: ClipboardList,
      visible: isAdmin,
    },
    {
      href: "/dashboard/admin/analytics",
      label: "Analytics",
      icon: BarChart3,
      visible: isAdmin,
    },
  ];

  async function handleLogout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="flex w-full flex-col bg-slate-950 text-white lg:min-h-screen lg:w-72">
      {/* Logo */}
      <div className="border-b border-slate-800 p-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="grid size-9 place-items-center rounded-xl bg-green-700">
            <ShoppingBag size={19} />
          </span>
          ShopNest
        </Link>
      </div>

      {/* User info */}
      <div className="border-b border-slate-800 p-6">
        <div className="flex items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-full bg-green-700 font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{user.name}</p>
            <p className="capitalize text-sm text-green-400">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 gap-2 overflow-x-auto p-4 lg:flex-col">
        {links
          .filter((link) => link.visible)
          .map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/dashboard"
                ? pathname === link.href
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
                  isActive
                    ? "bg-green-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={19} />
                {link.label}
              </Link>
            );
          })}
      </nav>

      {/* Logout */}
      <div className="hidden border-t border-slate-800 p-4 lg:block">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-slate-300 transition hover:bg-red-950 hover:text-red-300"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
}