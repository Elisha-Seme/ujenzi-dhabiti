"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, LayoutDashboard, LogOut, HardHat, PencilRuler, Home, Package, Truck } from "lucide-react";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/products", label: "Materials", icon: Package },
  { href: "/admin/plans", label: "House Plans", icon: Home },
  { href: "/admin/delivery", label: "Delivery", icon: Truck },
  { href: "/admin/projects", label: "What We've Built", icon: HardHat },
  { href: "/admin/architectural", label: "Architectural", icon: PencilRuler },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="min-h-screen bg-ud-light-gray flex">
      <aside className="hidden md:flex w-60 bg-ud-dark text-white flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/" className="text-sm font-semibold text-ud-burgundy tracking-wide">
            Ujenzi Dhabiti
          </Link>
          <p className="text-white/40 text-xs mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                  active ? "bg-ud-burgundy text-white" : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-ud-dark text-white px-4 py-3 flex items-center gap-2">
        <Link href="/" className="text-sm font-semibold text-ud-burgundy">Ujenzi Dhabiti</Link>
        <span className="text-white/40 text-sm">Admin</span>
        <div className="ml-auto flex gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`p-2 rounded ${path === href ? "bg-ud-burgundy" : "text-white/60"}`} title={label}>
              <Icon className="w-4 h-4" />
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-2 rounded text-white/60 hover:text-white hover:bg-white/10"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <main className="flex-1 min-w-0 pt-14 md:pt-0">{children}</main>
    </div>
  );
}
