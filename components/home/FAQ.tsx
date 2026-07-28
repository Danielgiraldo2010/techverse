export function FAQ() {
  return (
    <section className="section" id="preguntas">
      <div className="container">
        <header className="section-header">
          <div className="eyebrow">Resolvemos tus dudas.</div>
          <h2>Preguntas frecuentes.</h2>
        </header>

        <div className="faq">
          <details>
            <summary>¿Los tres modelos incluyen cable?</summary>
            <p>
              En esta tienda se indica que AirPods 4 trae cable incluido y que AirPods Pro 3 y AirPods Max incluyen el cable dentro de la caja.
            </p>
          </details>

          <details>
            <summary>¿Tienen cancelación de ruido?</summary>
            <p>
              La página presenta AirPods Pro 3 y AirPods 4 como opciones con cancelación de ruido. En AirPods Max se recomienda verificar la referencia exacta antes de prometer una función específica.
            </p>
          </details>

          <details>
            <summary>¿Puedo pagar cuando llegue el pedido?</summary>
            <p>La experiencia de compra mantiene el flujo contraentrega como referencia del sitio original.</p>
          </details>

          <details>
            <summary>¿Cuánto tarda el envío?</summary>
            <p>El tiempo de entrega depende de la ciudad y de la operación logística.</p>
          </details>

          <details>
            <summary>¿Son originales de Apple?</summary>
            <p>
              La tienda no se presenta como distribuidor oficial. Mantén siempre la descripción real del producto para evitar reclamaciones o confusiones.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}