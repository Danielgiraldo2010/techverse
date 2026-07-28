"use client";

import Image from "next/image";

import type { Product } from "@/data/products";
import { formatCurrency } from "@/lib/formatCurrency";
import { Modal } from "@/components/ui/Modal";
import { useCart } from "@/components/cart/CartProvider";

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
  const { addItem } = useCart();
  const galleryImages = product?.images?.length ? product.images : product ? [product.image] : [];

  return (
    <Modal open={Boolean(product)} title={product?.name ?? "Detalles del producto"} onClose={onClose} size="lg">
      {product ? (
        <>
          <div className="product-gallery" aria-label={`Fotos de ${product.name}`}>
            {galleryImages.map((image, index) => (
              <div className={index === 0 ? "gallery-photo gallery-photo-main" : "gallery-photo"} key={image}>
                <Image src={image} alt={`${product.name} foto ${index + 1}`} fill sizes={index === 0 ? "(max-width: 700px) 100vw, 760px" : "160px"} />
              </div>
            ))}
          </div>

          <p className="modal-lead">{product.description}</p>

          <div className="detail-grid">
            <section>
              <h4>Características</h4>
              <ul className="detail-list">
                {product.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>

            <section>
              <h4>Contenido de la caja</h4>
              <ul className="detail-list">
                {product.boxContents.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>

          <div className="checkout-summary">
            <div>
              <span>Precio</span>
              <strong>{formatCurrency(product.price)}</strong>
            </div>
            {typeof product.previousPrice === "number" ? (
              <div>
                <span>Precio anterior</span>
                <strong>{formatCurrency(product.previousPrice)}</strong>
              </div>
            ) : null}
            <div>
              <span>Stock disponible</span>
              <strong>{product.stock}</strong>
            </div>
          </div>

          <button className="btn btn-primary btn-block" type="button" onClick={() => addItem(product.id)}>
            Agregar al carrito
          </button>
        </>
      ) : null}
    </Modal>
  );
}
