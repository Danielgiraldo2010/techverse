export function Reviews() {
  return (
    <section className="section section-soft" id="opiniones">
      <div className="container">
        <header className="section-header">
          <div className="eyebrow">Compradores satisfechos.</div>
          <h2>Opiniones que generan confianza.</h2>
          <p>Reemplaza estos textos de demostración por reseñas reales de tus clientes.</p>
        </header>

        <div className="review-summary">
          <div className="score-card">
            <span className="score-number">4,9</span>
            <div className="stars">★★★★★</div>
            <span className="muted-text">Basado en opiniones de ejemplo</span>
          </div>

          <div className="rating-bars">
            <div className="bar-row"><span>5 ★</span><div className="bar"><span style={{ width: "94%" }} /></div><span>94%</span></div>
            <div className="bar-row"><span>4 ★</span><div className="bar"><span style={{ width: "5%" }} /></div><span>5%</span></div>
            <div className="bar-row"><span>3 ★</span><div className="bar"><span style={{ width: "1%" }} /></div><span>1%</span></div>
            <div className="bar-row"><span>2 ★</span><div className="bar"><span style={{ width: "0%" }} /></div><span>0%</span></div>
            <div className="bar-row"><span>1 ★</span><div className="bar"><span style={{ width: "0%" }} /></div><span>0%</span></div>
          </div>
        </div>

        <div className="review-grid">
          <article className="review-card">
            <div className="stars">★★★★★</div>
            <p>“El sonido es limpio, se conectaron rápido y llegaron bien empacados.”</p>
            <div className="buyer">
              <span className="avatar">CM</span>
              <div>
                <strong>Carolina M.</strong>
                <small>Compra verificada</small>
              </div>
            </div>
          </article>

          <article className="review-card">
            <div className="stars">★★★★★</div>
            <p>“La cancelación funciona bien para estudiar y el estuche mantiene la carga.”</p>
            <div className="buyer">
              <span className="avatar">JR</span>
              <div>
                <strong>Juan R.</strong>
                <small>Compra verificada</small>
              </div>
            </div>
          </article>

          <article className="review-card">
            <div className="stars">★★★★★</div>
            <p>“Compré contraentrega y el proceso fue sencillo. Buena atención por WhatsApp.”</p>
            <div className="buyer">
              <span className="avatar">LV</span>
              <div>
                <strong>Laura V.</strong>
                <small>Compra verificada</small>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}