"use client";

import { useState } from "react";

import { type Product } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductDetailsModal } from "@/components/products/ProductDetailsModal";
import { useCatalog } from "@/components/catalog/CatalogProvider";

export function ProductSection() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { activeProducts: products } = useCatalog();

  return (
    <section className="section section-soft" id="productos">
      <div className="container">
        <header className="section-header">
          <div className="eyebrow">Elige tu modelo.</div>
          <h2>Cuatro formas de disfrutar el sonido.</h2>
          <p>Compara diseño, batería, ajuste y nivel de aislamiento antes de comprar.</p>
        </header>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onOpenDetails={setSelectedProduct} />
          ))}
        </div>
      </div>

      <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
}
