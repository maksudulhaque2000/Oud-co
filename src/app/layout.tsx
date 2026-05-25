import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata: Metadata = {
  title: "Oud.co | Perfume Oil & Attar",
  description: "Premium perfume oil and attar e-commerce experience.",
  icons: {
    icon: "/hero.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <ToastProvider>
                <div className="app-shell">
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </ToastProvider>
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
