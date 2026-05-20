import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/shop/CartSidebar";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Ujenzi Dhabiti — Connecting Africa",
  description:
    "Infrastructure development company based in Nairobi, Kenya. Roads, buildings, water systems, and logistics across Africa.",
  keywords: ["infrastructure", "construction", "Kenya", "Africa", "roads", "civil engineering"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link
          rel="stylesheet"
          href="https://fonts.cdnfonts.com/css/neris"
        />
      </head>
      <body className="font-neris">
        <AuthProvider>
          <CartProvider>
            <Header />
            <CartSidebar />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
