import Link from "next/link";
import { db, orders, users, housePlans, products } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { ClipboardList, Users, Home, HardHat, ArrowRight, Package } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [pendingOrders] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, "pending"));

    const [totalUsers] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [totalPlans] = await db.select({ count: sql<number>`count(*)` }).from(housePlans);
    const [totalProducts] = await db.select({ count: sql<number>`count(*)` }).from(products);

    return {
      pendingOrders: Number(pendingOrders?.count ?? 0),
      totalUsers: Number(totalUsers?.count ?? 0),
      totalPlans: Number(totalPlans?.count ?? 0),
      totalProducts: Number(totalProducts?.count ?? 0),
    };
  } catch (err) {
    console.error("[admin] stats failed:", err);
    return { pendingOrders: 0, totalUsers: 0, totalPlans: 0, totalProducts: 0 };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: ClipboardList,
      href: "/admin/orders",
      cta: "Manage",
    },
    {
      label: "Materials",
      value: stats.totalProducts,
      icon: Package,
      href: "/admin/products",
      cta: "Manage",
    },
    {
      label: "House Plans",
      value: stats.totalPlans,
      icon: Home,
      href: "/admin/plans",
      cta: "Manage",
    },
    {
      label: "Registered Users",
      value: stats.totalUsers,
      icon: Users,
      href: null,
      cta: null,
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ud-dark">Admin Dashboard</h1>
        <p className="text-sm text-ud-dark/50 mt-0.5">Ujenzi Dhabiti overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, href, cta }) => {
          const inner = (
            <div className="bg-white rounded-[4px] shadow-sm p-5 border-t-2 border-ud-burgundy hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-ud-dark/50 uppercase tracking-wide">{label}</p>
                <Icon className="w-4 h-4 text-ud-burgundy" />
              </div>
              <p className="text-2xl font-bold text-ud-dark mt-auto">{value}</p>
              {cta && (
                <p className="text-xs text-ud-burgundy mt-3 flex items-center gap-1 font-semibold">
                  {cta} <ArrowRight className="w-3 h-3" />
                </p>
              )}
            </div>
          );
          return href ? (
            <Link key={label} href={href}>{inner}</Link>
          ) : (
            <div key={label}>{inner}</div>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/orders" className="bg-white rounded-[4px] shadow-sm p-6 hover:shadow-md transition-shadow">
          <ClipboardList className="w-6 h-6 text-ud-burgundy mb-3" />
          <h2 className="font-semibold text-ud-dark mb-1">Manage Orders</h2>
          <p className="text-sm text-ud-dark/55">Confirm bank payments and update order status.</p>
        </Link>
        <Link href="/admin/products" className="bg-white rounded-[4px] shadow-sm p-6 hover:shadow-md transition-shadow">
          <Package className="w-6 h-6 text-ud-burgundy mb-3" />
          <h2 className="font-semibold text-ud-dark mb-1">Materials</h2>
          <p className="text-sm text-ud-dark/55">Add, edit, and publish building-material products.</p>
        </Link>
        <Link href="/admin/plans" className="bg-white rounded-[4px] shadow-sm p-6 hover:shadow-md transition-shadow">
          <Home className="w-6 h-6 text-ud-burgundy mb-3" />
          <h2 className="font-semibold text-ud-dark mb-1">House Plans</h2>
          <p className="text-sm text-ud-dark/55">Add, edit, and publish the house-plan catalogue.</p>
        </Link>
        <Link href="/admin/projects" className="bg-white rounded-[4px] shadow-sm p-6 hover:shadow-md transition-shadow">
          <HardHat className="w-6 h-6 text-ud-burgundy mb-3" />
          <h2 className="font-semibold text-ud-dark mb-1">What We&apos;ve Built</h2>
          <p className="text-sm text-ud-dark/55">Manage completed projects shown on the site.</p>
        </Link>
      </div>
    </div>
  );
}
