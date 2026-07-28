import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CatalogProvider } from "@/components/catalog/CatalogProvider";
import { STORE_CONFIG } from "@/lib/constants";
import { env } from "@/lib/env";
import { listCatalogProducts } from "@/lib/catalog";

import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${STORE_CONFIG.name} | ${STORE_CONFIG.slogan}`,
    template: `%s | ${STORE_CONFIG.name}`
  },
  description: "Tienda online de audífonos inalámbricos TECHVERSE con catálogo estático, carrito persistente y pago preparado para Mercado Pago Colombia.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  },
  openGraph: {
    title: `${STORE_CONFIG.name} | ${STORE_CONFIG.slogan}`,
    description: "Tienda online de audífonos inalámbricos TECHVERSE con carrito persistente y checkout preparado para Mercado Pago Colombia.",
    url: env.NEXT_PUBLIC_SITE_URL,
    siteName: STORE_CONFIG.name,
    locale: "es_CO",
    type: "website"
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const products = await listCatalogProducts();

  return (
    <html lang="es">
      <body>
        <CatalogProvider initialProducts={products}>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
