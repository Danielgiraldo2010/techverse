"use client";

import Image from "next/image";

import type { Product } from "@/data/products";
import { formatCurrency } from "@/lib/formatCurrency";
import { useCart } from "@/components/cart/CartProvider";

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

const PRODUCT_LABELS: Record<string, string> = {
  pro3: "Oferta",
  air4: "-15%",
  max: "Oferta"
};

const PRODUCT_RATINGS: Record<string, string> = {
  pro3: "4,9 · 186 opiniones",
  air4: "4,9 · 252 opiniones",
  max: "Nuevo"
};

export function ProductCard({ product, onOpenDetails }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <article className={`product-card${product.featured ? " featured" : ""}`}>
      <div className="product-media">
        <span className="discount">{PRODUCT_LABELS[product.id] ?? "Oferta"}</span>
        <span className="stock">Disponible</span>
        <Image className="product-image" src={product.image} alt={product.name} fill sizes="(max-width: 980px) 100vw, 33vw" priority={product.featured} />
      </div>

      <div className="product-content">
        <div className="rating">★★★★★ <span>{PRODUCT_RATINGS[product.id] ?? ""}</span></div>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-subtitle">{product.shortDescription}</p>

        <div className="chips">
          {product.features.slice(0, 3).map((feature) => (
            <span className="chip" key={feature}>
              {feature}
            </span>
          ))}
        </div>

        <div className="includes">
          <strong>Contenido:</strong> {product.boxContents.join(", ")}.
        </div>

        <div className="price-wrap">
          {typeof product.previousPrice === "number" ? <span className="old-price">{formatCurrency(product.previousPrice)}</span> : null}
          <span className="price">{formatCurrency(product.price)}</span>
          <div className="finance">Precio de demostración editable.</div>

          <div className="product-actions">
            <button className="btn btn-primary" type="button" onClick={() => addItem(product.id)}>
              Agregar al carrito
            </button>
            <button className="quick-view" type="button" onClick={() => onOpenDetails(product)} aria-label={`Ver detalles de ${product.name}`}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                <path d="M12 10v6m0-9h.01" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}