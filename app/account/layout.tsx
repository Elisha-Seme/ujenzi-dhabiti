"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, ShoppingBag, FileText, MapPin, User, Percent } from "lucide-react";

const TABS = [
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/quotes", label: "Quotes", icon: FileText },
  { href: "/account/saved-carts", label: "Saved Carts", icon: ShoppingBag },
  { href: "/account/addresses", label: "Address Book", icon: MapPin },
  { href: "/account/contractor-pricing", label: "Contractor Pricing", icon: Percent },
  { href: "/account/profile", label: "Profile", icon: User },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="min-h-screen bg-ud-light-gray">
      {/* Account sub-nav */}
      <div className="bg-ud-dark pt-20">
        <div className="max-w-4xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = path === href || path.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`whitespace-nowrap flex items-center gap-1.5 text-xs md:text-sm font-semibold py-4 px-3 border-b-2 transition-colors ${
                  active
                    ? "text-white border-ud-burgundy"
                    : "text-white/50 border-transparent hover:text-white hover:border-white/30"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-10">{children}</div>
    </div>
  );
}
