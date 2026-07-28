"use client";

import Image from "next/image";

import { formatCurrency } from "@/lib/formatCurrency";
import type { CartResolvedLine } from "@/lib/cart";
import { useCart } from "@/components/cart/CartProvider";

interface CartItemProps {
  item: CartResolvedLine;
}

export function CartItem({ item }: CartItemProps) {
  const { setQuantity, removeItem } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-thumb">
        <Image src={item.product.image} alt={item.product.name} width={72} height={72} />
      </div>
      <div>
        <strong>{item.product.name}</strong>
        <small>{formatCurrency(item.product.price)}</small>
        <div className="quantity-controls">
          <button type="button" className="icon-button quantity-button" onClick={() => setQuantity(item.product.id, item.quantity - 1)} aria-label={`Reducir cantidad de ${item.product.name}`}>
            −
          </button>
          <span>{item.quantity}</span>
          <button type="button" className="icon-button quantity-button" onClick={() => setQuantity(item.product.id, item.quantity + 1)} aria-label={`Aumentar cantidad de ${item.product.name}`}>
            +
          </button>
        </div>
      </div>
      <button type="button" className="cart-remove" onClick={() => removeItem(item.product.id)} aria-label={`Eliminar ${item.product.name}`}>
        ×
      </button>
    </div>
  );
}