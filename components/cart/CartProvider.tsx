"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { type CartLine, type CartResolvedLine, calculateCartTotals, resolveCartLines } from "@/lib/cart";
import { useCatalog } from "@/components/catalog/CatalogProvider";

interface CartContextValue {
  items: CartLine[];
  resolvedItems: CartResolvedLine[];
  totalItems: number;
  subtotal: number;
  isDrawerOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CART_STORAGE_KEY = "techverse-cart-v1";

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartLine[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as CartLine[];

    return Array.isArray(parsed)
      ? parsed
          .map((item) => ({ productId: item.productId, quantity: Number(item.quantity) }))
          .filter((item) => item.productId && item.quantity > 0)
      : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { products, getProductById } = useCatalog();
  const [items, setItems] = useState<CartLine[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
    setIsReady(true);
  }, []);

  useEffect(() => {
    setItems((currentItems) =>
      currentItems.filter((item) => {
        const product = getProductById(item.productId);
        return Boolean(product?.active);
      })
    );
  }, [getProductById]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isReady]);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", isDrawerOpen);

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isDrawerOpen]);

  function addItem(productId: string, quantity = 1) {
    const product = getProductById(productId);

    if (!product || !product.active) {
      return;
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === productId);

      if (!existingItem) {
        return [...currentItems, { productId, quantity: Math.min(quantity, product.stock) }];
      }

      return currentItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
          : item
      );
    });

    setIsDrawerOpen(true);
  }

  function removeItem(productId: string) {
    setItems((currentItems) => currentItems.filter((item) => item.productId !== productId));
  }

  function setQuantity(productId: string, quantity: number) {
    const product = getProductById(productId);

    if (!product || !product.active) {
      return;
    }

    const nextQuantity = Math.max(1, Math.min(quantity, product.stock));

    setItems((currentItems) =>
      currentItems.map((item) => (item.productId === productId ? { ...item, quantity: nextQuantity } : item))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totals = calculateCartTotals(items, products);
  const resolvedItems = resolveCartLines(items, products);

  const value: CartContextValue = {
    items,
    resolvedItems,
    totalItems: totals.quantity,
    subtotal: totals.subtotal,
    isDrawerOpen,
    openCart: () => setIsDrawerOpen(true),
    closeCart: () => setIsDrawerOpen(false),
    toggleCart: () => setIsDrawerOpen((current) => !current),
    addItem,
    removeItem,
    setQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
