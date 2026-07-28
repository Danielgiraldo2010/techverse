import { Suspense } from "react";

import { PaymentResultClient } from "@/components/checkout/PaymentResultClient";

export default function PaymentResultPage() {
  return (
    <section className="section payment-result-page">
      <Suspense fallback={<div className="container payment-result-card"><h1>Consultando estado...</h1></div>}>
        <PaymentResultClient />
      </Suspense>
    </section>
  );
}