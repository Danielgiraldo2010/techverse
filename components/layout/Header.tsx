"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { STORE_CONFIG } from "@/lib/constants";
import { useCart } from "@/components/cart/CartProvider";

const NAV_ITEMS = [
  { href: "/#productos", label: "Productos" },
  { href: "/#comparar", label: "Comparar" },
  { href: "/#opiniones", label: "Opiniones" },
  { href: "/#preguntas", label: "Preguntas" }
];

export function Header() {
  const { totalItems, openCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const whatsappUrl = STORE_CONFIG.whatsapp ? `https://wa.me/${STORE_CONFIG.whatsapp}` : "";

  return (
    <header className="header">
      <div className="container nav">
        <Link href="/" className="logo" aria-label="Ir al inicio de TECHVERSE">
          <Image className="brand-logo" src="/logo-techverse.svg" alt="TECHVERSE - Tecnología sin límites" width={180} height={56} priority />
        </Link>

        <nav className="nav-links" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          {whatsappUrl ? (
            <a className="icon-button" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.3-4.7A8.5 8.5 0 1 1 20.5 11.8Z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8.2 7.7c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4-.1.6.6 1.3 1.7 2.4 3 3 .2.1.4.1.6-.1l.8-1c.2-.2.4-.3.7-.2l1.8.8c.3.1.4.3.4.5 0 .4-.2 1.2-.7 1.7-.5.6-1.4.9-2.3.7-1.4-.2-3.1-1-4.8-2.5-1.6-1.4-2.8-3.2-3.1-4.8-.2-.8.1-1.5.5-2Z" fill="currentColor" />
              </svg>
            </a>
          ) : (
            <button className="icon-button icon-button-disabled" type="button" disabled aria-label="WhatsApp no configurado">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.3-4.7A8.5 8.5 0 1 1 20.5 11.8Z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8.2 7.7c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4-.1.6.6 1.3 1.7 2.4 3 3 .2.1.4.1.6-.1l.8-1c.2-.2.4-.3.7-.2l1.8.8c.3.1.4.3.4.5 0 .4-.2 1.2-.7 1.7-.5.6-1.4.9-2.3.7-1.4-.2-3.1-1-4.8-2.5-1.6-1.4-2.8-3.2-3.1-4.8-.2-.8.1-1.5.5-2Z" fill="currentColor" />
              </svg>
            </button>
          )}

          <button className="icon-button" type="button" onClick={openCart} aria-label="Abrir carrito">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
              <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20.2 8H6.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9.2" cy="19.2" r="1.2" fill="currentColor" />
              <circle cx="17.2" cy="19.2" r="1.2" fill="currentColor" />
            </svg>
            <span className="cart-badge">{totalItems}</span>
          </button>

          <button className="icon-button mobile-toggle" type="button" onClick={() => setIsMenuOpen((value) => !value)} aria-label="Menú" aria-expanded={isMenuOpen}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menú móvil">
          <div className="mobile-menu-panel">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <a href="#productos" onClick={() => setIsMenuOpen(false)}>
              Comprar ahora
            </a>
            <button type="button" className="btn btn-outline btn-block" onClick={openCart}>
              Abrir carrito
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}