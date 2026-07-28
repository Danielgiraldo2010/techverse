export function Benefits() {
  return (
    <>
      <section className="trust-strip" aria-label="Beneficios de compra">
        <div className="container trust-grid">
          <div className="trust-item">
            <span className="trust-icon">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h12v11H3V6Zm12 4h3l3 3v4h-6v-7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="1.7" />
                <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.7" />
              </svg>
            </span>
            <div>
              <strong>Envío nacional</strong>
              <span>Entrega según ciudad de destino</span>
            </div>
          </div>

          <div className="trust-item">
            <span className="trust-icon">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.7" />
                <path d="M3 10h18" stroke="currentColor" strokeWidth="1.7" />
              </svg>
            </span>
            <div>
              <strong>Pago contraentrega</strong>
              <span>Paga al recibir tu pedido</span>
            </div>
          </div>

          <div className="trust-item">
            <span className="trust-icon">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <path d="m12 3 7 3v5c0 4.7-2.7 8-7 10-4.3-2-7-5.3-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.7" />
                <path d="m9 12 2 2 4-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <strong>Compra protegida</strong>
              <span>Garantía según condiciones</span>
            </div>
          </div>

          <div className="trust-item">
            <span className="trust-icon">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <path d="M5 18v-3a7 7 0 0 1 14 0v3" stroke="currentColor" strokeWidth="1.7" />
                <path d="M5 18H3v-4h2m14 4h2v-4h-2" stroke="currentColor" strokeWidth="1.7" />
              </svg>
            </span>
            <div>
              <strong>Asesoría personalizada</strong>
              <span>Atención directa por WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container experience-grid">
          <article className="experience-main">
            <div className="sound-waves" aria-hidden="true">
              {Array.from({ length: 12 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
            <h2>
              Menos ruido.
              <br />
              Más música.
            </h2>
            <p>Elige una referencia con cancelación de ruido para concentrarte, estudiar, viajar o disfrutar tus canciones favoritas.</p>
          </article>

          <div className="experience-side">
            <article className="info-card">
              <div className="big-icon">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path d="M7 7h10v10H7V7Z" stroke="#6b37ca" strokeWidth="1.8" />
                  <path d="M9 3v4m6-4v4M9 17v4m6-4v4M3 9h4m10 0h4M3 15h4m10 0h4" stroke="#6b37ca" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Conexión rápida.</h3>
              <p>Emparejamiento Bluetooth sencillo con celulares, tabletas y computadores.</p>
            </article>

            <article className="info-card">
              <div className="big-icon">
                <svg width="31" height="31" viewBox="0 0 24 24" fill="none">
                  <path d="M9 3h6v3H9V3Zm-3 4h12v14H6V7Z" stroke="#178b59" strokeWidth="1.8" />
                  <path d="M9 11h6M9 15h6" stroke="#178b59" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Energía para tu día.</h3>
              <p>Estuches de carga y cables incluidos según la referencia seleccionada.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}