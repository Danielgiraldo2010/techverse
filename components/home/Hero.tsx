import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";

const HERO_PHOTOS = [
  {
    src: "/product-photos/airpods-pro-3/airpods-pro-3.0.JPG",
    alt: "AirPods Pro 3",
    className: "hero-photo hero-photo-small"
  },
  {
    src: "/product-photos/airpods-pro-2/airpods-pro-2.0.JPG",
    alt: "AirPods Pro 2",
    className: "hero-photo hero-photo-small"
  },
  {
    src: "/product-photos/airpods-max/airpods-max5-estuche-blanco.png",
    alt: "AirPods Max con estuche",
    className: "hero-photo hero-photo-main"
  },
  {
    src: "/product-photos/airpods-4/airpods-4.0.JPG",
    alt: "AirPods 4",
    className: "hero-photo hero-photo-small"
  },
  {
    src: "/product-photos/airpods-max/airpods-max4-negro.png",
    alt: "AirPods Max negro",
    className: "hero-photo hero-photo-small"
  }
];

export function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-showcase" aria-label="Fotos destacadas de audífonos TECHVERSE">
          <div className="hero-photo-column">
            {HERO_PHOTOS.slice(0, 2).map((photo, index) => (
              <div className={photo.className} key={photo.src}>
                <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 42vw, 220px" priority={index === 0} />
              </div>
            ))}
          </div>

          <div className={HERO_PHOTOS[2].className}>
            <Image src={HERO_PHOTOS[2].src} alt={HERO_PHOTOS[2].alt} fill sizes="(max-width: 700px) 92vw, 560px" priority />
          </div>

          <div className="hero-photo-column">
            {HERO_PHOTOS.slice(3).map((photo) => (
              <div className={photo.className} key={photo.src}>
                <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 42vw, 220px" />
              </div>
            ))}
          </div>
        </div>

        <div className="hero-copy">
          <div className="eyebrow">El sonido que estabas buscando.</div>
          <h1>
            Escucha cada
            <br />
            detalle.
          </h1>
          <p className="hero-subtitle">
            Audífonos inalámbricos con diseño premium, conexión rápida y opciones con cancelación de ruido.
          </p>

          <div className="hero-actions">
            <ButtonLink href="#productos" variant="primary">
              Comprar ahora
            </ButtonLink>
            <ButtonLink href="#comparar" variant="outline">
              Comparar modelos
            </ButtonLink>
          </div>

          <p className="hero-note">Compatibles con iOS y Android. Verifica las funciones exactas de cada referencia.</p>
        </div>
      </div>
    </section>
  );
}
