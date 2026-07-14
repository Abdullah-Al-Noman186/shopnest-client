import { BarChart3, Heart, Package, ShoppingCart } from "lucide-react";
import { getCurrentUser } from "@/lib/current-user";

const buyerStats = [
  { label: "Total Orders", value: "0", icon: ShoppingCart },
  { label: "Wishlist Items", value: "0", icon: Heart },
  { label: "Account Status", value: "Active", icon: BarChart3 },
];

const sellerStats = [
  { label: "Total Listings", value: "0", icon: Package },
  { label: "Total Orders", value: "0", icon: ShoppingCart },
  { label: "Revenue", value: "$0.00", icon: BarChart3 },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  const stats =
    user.role === "seller" || user.role === "admin" ? sellerStats : buyerStats;

  return (
    <section>
      <p className="font-semibold text-green-700">DASHBOARD</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">
        Welcome back, {user.name.split(" ")[0]}.
      </h1>
      <p className="mt-2 text-slate-600">
        Here is a quick view of your ShopNest account.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <span className="rounded-xl bg-green-100 p-3 text-green-800">
                  <Icon size={23} />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Getting started</h2>
        <p className="mt-3 text-slate-600">
          Your dashboard is ready. Product listings, charts, and account
          management will appear here as you use ShopNest.
        </p>
      </section>
    </section>
  );
}