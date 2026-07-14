import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";
import DashboardSidebar from "@/components/layout/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <DashboardSidebar user={user} />
      <main className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
    </div>
  );
}