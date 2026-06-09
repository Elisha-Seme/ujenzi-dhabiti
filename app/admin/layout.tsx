"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, LayoutDashboard, LogOut, HardHat, PencilRuler, Home, Package, Truck, Mail, Settings, Award, Layers, Users, BarChart3, HelpCircle, Hammer } from "lucide-react";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/products", label: "Materials", icon: Package },
  { href: "/admin/plans", label: "House Plans", icon: Home },
  { href: "/admin/delivery", label: "Delivery", icon: Truck },
  { href: "/admin/services", label: "Services Catalog", icon: Hammer },
  { href: "/admin/services/subsections", label: "Service Subsections", icon: Layers },
  { href: "/admin/projects", label: "What We've Built", icon: HardHat },
  { href: "/admin/architectural", label: "Architectural", icon: PencilRuler },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/settings", label: "System Settings", icon: Settings },
  { href: "/admin/core-values", label: "Core Values", icon: Award },
  { href: "/admin/why-choose-us", label: "Why Choose Us", icon: Layers },
  { href: "/admin/team", label: "Team Members", icon: Users },
  { href: "/admin/stats", label: "Company Stats", icon: BarChart3 },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="min-h-screen bg-ud-light-gray flex">
      <aside className="hidden md:flex w-60 bg-ud-dark text-white flex-col flex-shrink-0 max-h-screen sticky top-0">
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/" className="text-sm font-semibold text-ud-burgundy tracking-wide">
            Ujenzi Dhabiti
          </Link>
          <p className="text-white/40 text-xs mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
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
        <span className="text-white/40 text-sm flex-shrink-0">Admin</span>
        <div className="ml-auto flex items-center gap-1 overflow-x-auto max-w-[calc(100vw-160px)] no-scrollbar flex-nowrap py-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`p-2 rounded flex-shrink-0 ${path === href ? "bg-ud-burgundy" : "text-white/60"}`} title={label}>
              <Icon className="w-4 h-4" />
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-2 rounded text-white/60 hover:text-white hover:bg-white/10 flex-shrink-0"
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
