"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import CartSidebar from "@/components/shop/CartSidebar";
import WhatsAppButton from "./WhatsAppButton";

export default function SiteLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith("/admin");
  const isAuthPath = pathname.startsWith("/auth");

  if (isAdminPath || isAuthPath) {
    return (
      <div className="min-h-screen bg-ud-light-gray">
        {children}
      </div>
    );
  }

  return (
    <>
      <Header />
      <CartSidebar />
      {children}
      <WhatsAppButton />
      <Footer />
    </>
  );
}
