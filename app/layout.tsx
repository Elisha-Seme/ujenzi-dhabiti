import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/shop/CartSidebar";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import LoadingScreen from "@/components/layout/LoadingScreen";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ujenzidhabiti.co.ke"),
  title: "Ujenzi Dhabiti — Connecting Africa",
  description:
    "Infrastructure development company based in Nairobi, Kenya. Roads, buildings, water systems, and logistics across Africa.",
  keywords: ["infrastructure", "construction", "Kenya", "Africa", "roads", "civil engineering"],
  openGraph: {
    title: "Ujenzi Dhabiti — Connecting Africa",
    description:
      "Construction and infrastructure company connecting Africa — a subsidiary of Ardhi Safi Limited.",
    url: "https://www.ujenzidhabiti.co.ke",
    siteName: "Ujenzi Dhabiti",
    images: [{ url: "/logo-stacked-dark.jpg", width: 2250, height: 2250, alt: "Ujenzi Dhabiti" }],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ujenzi Dhabiti — Connecting Africa",
    description:
      "Construction and infrastructure company connecting Africa — a subsidiary of Ardhi Safi Limited.",
    images: ["/logo-stacked-dark.jpg"],
  },
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
        <LoadingScreen />
        <AuthProvider>
          <CartProvider>
            <Header />
            <CartSidebar />
            <main>{children}</main>
            <WhatsAppButton />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
