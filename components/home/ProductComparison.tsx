"use client";

import { formatCurrency } from "@/lib/formatCurrency";
import { useCatalog } from "@/components/catalog/CatalogProvider";

export function ProductComparison() {
  const { getProductById } = useCatalog();
  const pro3 = getProductById("pro3");
  const air4 = getProductById("air4");
  const max = getProductById("max");

  if (!pro3 || !air4 || !max) {
    return null;
  }

  return (
    <section className="section section-soft" id="comparar">
      <div className="container">
        <header className="section-header">
          <div className="eyebrow">Comparación rápida.</div>
          <h2>¿Cuál es para ti?</h2>
          <p>Una guía sencilla para ayudarte a elegir el modelo adecuado.</p>
        </header>

        <div className="comparison">
          <table>
            <thead>
              <tr>
                <th>Característica</th>
                <th>{pro3.name}</th>
                <th>{air4.name}</th>
                <th>{max.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Diseño</td>
                <td>In-ear con almohadillas</td>
                <td>Abierto</td>
                <td>Diadema</td>
              </tr>
              <tr>
                <td>Cancelación activa de ruido</td>
                <td className="check">Sí</td>
                <td className="check">Sí</td>
                <td className="dash">Verificar referencia</td>
              </tr>
              <tr>
                <td>Aislamiento exterior</td>
                <td className="check">Alto</td>
                <td>Medio</td>
                <td className="check">Alto</td>
              </tr>
              <tr>
                <td>Cable incluido</td>
                <td className="check">En la caja</td>
                <td className="check">Sí</td>
                <td className="check">En la caja</td>
              </tr>
              <tr>
                <td>Uso recomendado</td>
                <td>Viaje y concentración</td>
                <td>Uso diario</td>
                <td>Música y entretenimiento</td>
              </tr>
              <tr>
                <td>Precio de demostración</td>
                <td>
                  <strong>{formatCurrency(pro3.price)}</strong>
                </td>
                <td>
                  <strong>{formatCurrency(air4.price)}</strong>
                </td>
                <td>
                  <strong>{formatCurrency(max.price)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}