import Image from "next/image";
import Link from "next/link";

import { STORE_CONFIG } from "@/lib/constants";

export function Footer() {
  const whatsappUrl = STORE_CONFIG.whatsapp ? `https://wa.me/${STORE_CONFIG.whatsapp}` : "";

  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="logo" aria-label="TECHVERSE">
              <Image className="footer-brand-logo" src="/logo-techverse.svg" alt="TECHVERSE - Tecnología sin límites" width={220} height={72} />
            </Link>
            <p>
              Tecnología sin límites. Audífonos inalámbricos, accesorios y soluciones tecnológicas con atención personalizada.
            </p>
          </div>

          <div className="footer-column">
            <h4>Comprar</h4>
            <Link href="/#productos">AirPods Pro 3</Link>
            <Link href="/#productos">AirPods 4</Link>
            <Link href="/#productos">AirPods Max</Link>
          </div>

          <div className="footer-column">
            <h4>Ayuda</h4>
            <Link href="/#preguntas">Preguntas frecuentes</Link>
            <Link href="/#productos">Catálogo</Link>
            <Link href="/checkout">Checkout</Link>
          </div>

          <div className="footer-column">
            <h4>Contacto</h4>
            <Link href="/#opiniones">Reseñas</Link>
            {whatsappUrl ? (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            ) : (
              <span className="disabled-link">WhatsApp no configurado</span>
            )}
          </div>
        </div>

        <div className="legal">
          <p>
            © {new Date().getFullYear()} TECHVERSE. Todos los derechos reservados. Apple, AirPods y sus denominaciones son marcas de sus respectivos titulares. Esta tienda no se presenta como distribuidor oficial.
          </p>
          <span>Colombia</span>
        </div>
      </div>
    </footer>
  );
}