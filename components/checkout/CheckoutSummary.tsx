"use client";

import { formatCurrency } from "@/lib/formatCurrency";
import { useCart } from "@/components/cart/CartProvider";

export function CheckoutSummary() {
  const { resolvedItems, subtotal } = useCart();

  return (
    <aside className="checkout-summary-panel" aria-label="Resumen del pedido">
      <h3>Resumen</h3>
      <div className="checkout-summary-list">
        {resolvedItems.map((item) => (
          <div key={item.product.id} className="checkout-summary-row">
            <span>
              {item.quantity} × {item.product.name}
            </span>
            <strong>{formatCurrency(item.lineTotal)}</strong>
          </div>
        ))}
      </div>
      <div className="checkout-summary-total">
        <span>Subtotal</span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>
      <div className="checkout-summary-total">
        <span>Envío</span>
        <strong>Por confirmar</strong>
      </div>
      <div className="checkout-summary-total grand-total">
        <span>Total</span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>
    </aside>
  );
}