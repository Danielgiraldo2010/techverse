"use client";

import { formatCurrency } from "@/lib/formatCurrency";
import { SITE_PATHS } from "@/lib/constants";
import { useCart } from "@/components/cart/CartProvider";
import { ButtonLink } from "@/components/ui/Button";

export function CartSummary() {
  const { subtotal, totalItems, clearCart, items } = useCart();

  return (
    <div className="drawer-footer">
      <div className="total-row">
        <span>
          Subtotal <small>({totalItems} artículos)</small>
        </span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>
      <div className="drawer-actions">
        <ButtonLink href={SITE_PATHS.checkout} variant="primary" fullWidth>
          Ir al checkout
        </ButtonLink>
        <button type="button" className="btn btn-outline btn-block" onClick={clearCart} disabled={items.length === 0}>
          Vaciar carrito
        </button>
      </div>
      <div className="shipping-note">El valor del envío se confirma según el destino.</div>
    </div>
  );
}