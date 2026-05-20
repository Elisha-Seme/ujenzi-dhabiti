"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import CartButton from "@/components/shop/CartButton";

// Pages that DON'T have a dark hero behind the header — header should be solid dark from the start
const SOLID_HEADER_PATHS = ["/shop", "/track", "/auth", "/seller", "/admin", "/account"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const forceSolid = SOLID_HEADER_PATHS.some((p) => pathname.startsWith(p));
  const solid = forceSolid || scrolled;

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
        <div className="max-w-content mx-auto px-6 flex items-center justify-between h-16 md:h-20">
          <Link href="/">
            <Image src="/logo-horizontal-dark.jpg" alt="Ujenzi Dhabiti" width={180} height={60} className="h-10 w-auto object-contain" priority />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold tracking-wide transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-ud-white border-b-2 border-ud-burgundy pb-0.5"
                    : "text-white/80 hover:text-ud-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <CartButton />
            <Link href="/contact" className="bg-ud-burgundy text-ud-white text-sm font-semibold px-5 py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors duration-200">
              Get a Quote
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-4">
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
          <Link href="/">
            <Image src="/logo-horizontal-dark.jpg" alt="Ujenzi Dhabiti" width={180} height={60} className="h-10 w-auto object-contain" priority />
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
          <Link href="/contact" className="block w-full text-center bg-ud-burgundy text-ud-white text-sm font-semibold px-5 py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors duration-200">
            Get a Quote
          </Link>
        </div>
      </aside>
    </>
  );
}
