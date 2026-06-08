"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X, Search, User } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import CartButton from "@/components/shop/CartButton";
import Logo from "@/components/layout/Logo";

// Pages that DON'T have a dark hero behind the header — header should be solid dark from the start
const SOLID_HEADER_PATHS = ["/shop", "/track", "/auth", "/admin", "/account"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const forceSolid = SOLID_HEADER_PATHS.some((p) => pathname.startsWith(p));
  const solid = forceSolid || scrolled;

  // Account icon routes to the right place for who's signed in.
  const role = session?.user?.role;
  const accountHref = !session ? "/auth/signin" : role === "admin" ? "/admin" : "/account/orders";
  const accountLabel = role === "admin" ? "Admin panel" : "My account";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${solid ? "bg-ud-dark/95 backdrop-blur-sm shadow-lg" : "bg-transparent"}`}>
        <div className="max-w-content mx-auto px-6 flex items-center justify-between gap-4 h-16 md:h-20">
          <Link href="/" aria-label="Ujenzi Dhabiti Home" className="flex-shrink-0">
            <Logo variant="dark" className="h-8 xl:h-9 w-auto" priority />
          </Link>

          {/* Home is omitted here — the logo already links home; it stays in the drawer */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-semibold tracking-wide whitespace-nowrap transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-ud-white border-b-2 border-ud-burgundy pb-0.5"
                    : "text-white/80 hover:text-ud-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <Link href="/shop" aria-label="Search products" className="text-white/80 hover:text-ud-white transition-colors p-1">
              <Search size={18} />
            </Link>
            <Link href={accountHref} aria-label={accountLabel} className="text-white/80 hover:text-ud-white transition-colors p-1">
              <User size={18} />
            </Link>
            <CartButton />
            <Link href="/request-a-quote" className="bg-ud-burgundy text-ud-white text-[13px] font-semibold px-4 py-2 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors duration-200 whitespace-nowrap">
              Get a Quote
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            <Link href="/shop" aria-label="Search products" className="text-white/80 hover:text-ud-white transition-colors p-1.5">
              <Search size={20} />
            </Link>
            <Link href={accountHref} aria-label={accountLabel} className="text-white/80 hover:text-ud-white transition-colors p-1.5">
              <User size={20} />
            </Link>
            <CartButton />
            <button className="p-2 text-white" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <aside className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-ud-dark flex flex-col transition-transform duration-300 md:hidden ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link href="/" aria-label="Ujenzi Dhabiti Home">
            <Logo variant="dark" className="h-8 w-auto" />
          </Link>
          <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="text-white/60 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col px-6 py-8 gap-2 flex-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`py-3 text-base font-semibold border-b border-white/10 transition-colors duration-200 ${pathname === link.href ? "text-ud-white" : "text-white/70 hover:text-ud-white"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-6 pb-8">
          <Link href="/request-a-quote" className="block w-full text-center bg-ud-burgundy text-ud-white text-sm font-semibold px-5 py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors duration-200">
            Get a Quote
          </Link>
        </div>
      </aside>
    </>
  );
}
