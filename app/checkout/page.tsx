import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { ButtonLink } from "@/components/ui/Button";

export default function CheckoutPage() {
  return (
    <section className="section checkout-page">
      <div className="container checkout-layout">
        <div className="checkout-copy">
          <div className="eyebrow">Checkout</div>
          <h1>Completa tu pedido</h1>
          <p>Capturamos tus datos de envío y luego eliges si pagas con tarjeta, débito o transferencia.</p>
          <ButtonLink href="/#productos" variant="outline">
            Volver al catálogo
          </ButtonLink>
        </div>

        <CheckoutSummary />
        <CheckoutForm />
      </div>
    </section>
  );
}
