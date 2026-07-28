"use client";

import { useCart } from "@/components/cart/CartProvider";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";

export function CartDrawer() {
  const { resolvedItems, isDrawerOpen, closeCart } = useCart();

  return (
    <>
      <div className={`overlay${isDrawerOpen ? " show" : ""}`} onClick={closeCart} aria-hidden="true" />
      <aside className={`drawer${isDrawerOpen ? " show" : ""}`} aria-label="Carrito de compras" aria-modal="true" role="dialog">
        <div className="drawer-header">
          <h3>Tu carrito</h3>
          <button type="button" className="icon-button" onClick={closeCart} aria-label="Cerrar carrito">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="drawer-body">
          {resolvedItems.length === 0 ? (
            <div className="empty-cart">
              <div>
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 15px" }}>
                  <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20.2 8H6.1" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="9.2" cy="19.2" r="1.2" fill="currentColor" />
                  <circle cx="17.2" cy="19.2" r="1.2" fill="currentColor" />
                </svg>
                <strong>Tu carrito está vacío</strong>
                <p>Agrega un producto para continuar.</p>
              </div>
            </div>
          ) : (
            resolvedItems.map((item) => <CartItem key={item.product.id} item={item} />)
          )}
        </div>

        <CartSummary />
      </aside>
    </>
  );
}