import { Hero } from "@/components/home/Hero";
import { Benefits } from "@/components/home/Benefits";
import { ProductSection } from "@/components/home/ProductSection";
import { ProductComparison } from "@/components/home/ProductComparison";
import { Reviews } from "@/components/home/Reviews";
import { FAQ } from "@/components/home/FAQ";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Benefits />
      <ProductSection />
      <ProductComparison />
      <Reviews />
      <FAQ />
      <section className="final-cta">
        <div className="container">
          <h2>Tu próximo sonido está aquí.</h2>
          <p>Elige tu modelo, agrégalo al carrito y completa tus datos para continuar con el pago.</p>
          <div className="cta-actions">
            <a href="#productos" className="btn btn-white">
              Ver productos
            </a>
            <a href="#preguntas" className="btn btn-green">
              Resolver dudas
            </a>
          </div>
        </div>
      </section>
    </>
  );
}