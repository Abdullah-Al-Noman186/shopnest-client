import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";
import ManageListings from "@/components/layout/dashboard/ManageListings";

export default async function ManageProductsPage() {
  const user = await getCurrentUser();

  if (!user || (user.role !== "seller" && user.role !== "admin")) {
    redirect("/dashboard");
  }

  return (
    <section>
      <p className="font-semibold text-green-700">SELLER TOOLS</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">My Listings</h1>
      <p className="mt-2 text-slate-600">
        View and manage products you have added to ShopNest.
      </p>

      <div className="mt-8">
        <ManageListings />
      </div>
    </section>
  );
}