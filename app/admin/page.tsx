import Link from "next/link";
import { db, sellers, orders, users, products } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { ClipboardList, Store, Users, Package, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [pendingSellers] = await db
      .select({ count: sql<number>`count(*)` })
      .from(sellers)
      .where(eq(sellers.status, "pending"));

    const [pendingOrders] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, "pending"));

    const [totalUsers] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [totalProducts] = await db.select({ count: sql<number>`count(*)` }).from(products);

    return {
      pendingSellers: Number(pendingSellers?.count ?? 0),
      pendingOrders: Number(pendingOrders?.count ?? 0),
      totalUsers: Number(totalUsers?.count ?? 0),
      totalProducts: Number(totalProducts?.count ?? 0),
    };
  } catch (err) {
    console.error("[admin] stats failed:", err);
    return { pendingSellers: 0, pendingOrders: 0, totalUsers: 0, totalProducts: 0 };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      label: "Pending Seller Applications",
      value: stats.pendingSellers,
      icon: Store,
      href: "/admin/sellers",
      cta: "Review",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: ClipboardList,
      href: "/admin/orders",
      cta: "Manage",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      href: null,
      cta: null,
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      href: null,
      cta: null,
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ud-dark">Admin Dashboard</h1>
        <p className="text-sm text-ud-dark/50 mt-0.5">Marketplace overview</p>
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

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/admin/sellers" className="bg-white rounded-[4px] shadow-sm p-6 hover:shadow-md transition-shadow">
          <Store className="w-6 h-6 text-ud-burgundy mb-3" />
          <h2 className="font-semibold text-ud-dark mb-1">Manage Sellers</h2>
          <p className="text-sm text-ud-dark/55">Approve, reject, or suspend marketplace sellers.</p>
        </Link>
        <Link href="/admin/orders" className="bg-white rounded-[4px] shadow-sm p-6 hover:shadow-md transition-shadow">
          <ClipboardList className="w-6 h-6 text-ud-burgundy mb-3" />
          <h2 className="font-semibold text-ud-dark mb-1">Manage Orders</h2>
          <p className="text-sm text-ud-dark/55">Confirm bank payments and update order status.</p>
        </Link>
      </div>
    </div>
  );
}
