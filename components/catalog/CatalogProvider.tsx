"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import type { Product } from "@/data/products";

interface CatalogContextValue {
  products: Product[];
  activeProducts: Product[];
  getProductById: (id: string) => Product | undefined;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children, initialProducts }: { children: ReactNode; initialProducts: Product[] }) {
  const [products] = useState(initialProducts);

  const value = useMemo<CatalogContextValue>(() => {
    const getProductById = (id: string) => products.find((product) => product.id === id);

    return {
      products,
      activeProducts: products.filter((product) => product.active),
      getProductById
    };
  }, [products]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);

  if (!context) {
    throw new Error("useCatalog must be used within a CatalogProvider");
  }

  return context;
}
