import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";

import { formatCurrency } from "@/lib/formatCurrency";
import { STORE_CONFIG } from "@/lib/constants";
import { buildWhatsAppOrderLink, listStoredOrders } from "@/lib/orders";
import { isAdminSessionValueValid, ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";
import { listCatalogProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Esperando comprobante",
  PAYMENT_PENDING: "Pago en proceso",
  PAID: "Pago confirmado",
  READY: "Preparando envío",
  SHIPPED: "Pedido enviado",
  DECLINED: "Pago rechazado",
  CANCELLED: "Pedido cancelado"
};

const STATUS_HELP: Record<string, string> = {
  PENDING_PAYMENT: "El cliente eligió transferencia y falta revisar el comprobante.",
  PAYMENT_PENDING: "Mercado Pago creó el checkout, pero todavía no confirma pago.",
  PAID: "El dinero ya fue confirmado.",
  READY: "Pedido pagado y en preparación para despacho.",
  SHIPPED: "El pedido ya salió hacia el cliente.",
  DECLINED: "El pago fue rechazado o no se pudo completar.",
  CANCELLED: "Pedido cerrado sin envío."
};

const ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "PAYMENT_PENDING",
  "PAID",
  "READY",
  "SHIPPED",
  "DECLINED",
  "CANCELLED"
];

function adminLoginForm({ error }: { error?: string }) {
  return (
    <section className="section admin-page">
      <div className="container admin-shell admin-login-shell">
        <div className="admin-login-card">
          <div className="eyebrow">Panel privado</div>
          <h1>Acceso administrativo</h1>
          <p>Ingresa con la clave de administración para revisar pedidos y ajustar precios.</p>
          {error ? <p className="admin-note admin-error">La clave no es válida o faltan credenciales.</p> : null}
          <form className="admin-form" action="/api/admin/login" method="post">
            <label className="field full">
              <span>Contraseña</span>
              <input type="password" name="password" autoComplete="current-password" required />
            </label>
            <button className="btn btn-primary" type="submit">Entrar</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default async function AdminPage({ searchParams }: { searchParams?: Promise<{ error?: string; updated?: string }> }) {
  const params = (await searchParams) ?? {};
  const sessionValue = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;

  if (!isAdminSessionValueValid(sessionValue)) {
    return adminLoginForm({ error: params.error });
  }

  const [products, orders] = await Promise.all([listCatalogProducts(), listStoredOrders()]);

  return (
    <section className="section admin-page">
      <div className="container admin-shell">
        <div className="admin-topbar">
          <div>
            <div className="eyebrow">Panel privado</div>
            <h1>Operación de tienda</h1>
            <p>Gestiona pedidos, clientes y precios desde aquí.</p>
          </div>
          <div className="admin-topbar-actions">
            <Link className="btn btn-outline" href="/">Ver tienda</Link>
            <form action="/api/admin/logout" method="post">
              <button className="btn btn-dark" type="submit">Cerrar sesión</button>
            </form>
          </div>
        </div>

        {params.updated ? <p className="admin-note">Cambios guardados correctamente.</p> : null}
        {params.error ? <p className="admin-note admin-error">Hubo un problema al procesar la solicitud.</p> : null}

        <div className="admin-grid">
          <section className="admin-card admin-card-wide">
            <div className="admin-card-header">
              <div>
                <h2>Productos</h2>
                <p>Actualiza precio, stock y visibilidad.</p>
              </div>
              <strong>{products.length} referencias</strong>
            </div>

            <div className="admin-product-list">
              {products.map((product) => (
                <article key={product.id} className="admin-product-panel">
                  <form className="admin-product-form" action={`/api/admin/products/${product.id}`} method="post">
                    <div className="admin-product-heading">
                      <h3>{product.name}</h3>
                      <span>{product.slug}</span>
                    </div>

                    <label className="field">
                      <span>Precio actual</span>
                      <input type="number" name="price" min="1" defaultValue={product.price} />
                    </label>

                    <label className="field">
                      <span>Precio anterior</span>
                      <input type="number" name="previousPrice" min="1" defaultValue={product.previousPrice ?? ""} />
                    </label>

                    <label className="field">
                      <span>Stock</span>
                      <input type="number" name="stock" min="0" defaultValue={product.stock} />
                    </label>

                    <label className="admin-check">
                      <input type="checkbox" name="active" defaultChecked={product.active} />
                      <span>Activo</span>
                    </label>

                    <label className="admin-check">
                      <input type="checkbox" name="featured" defaultChecked={product.featured} />
                      <span>Destacado</span>
                    </label>

                    <div className="admin-product-summary">
                      <span>{formatCurrency(product.price)}</span>
                      <small>Stock: {product.stock}</small>
                    </div>

                    <button className="btn btn-primary" type="submit">Guardar cambios</button>
                  </form>

                  <form className="admin-image-form" action={`/api/admin/products/${product.id}/images`} method="post" encType="multipart/form-data">
                    <div className="admin-image-preview">
                      <Image src={product.image} alt={`Imagen principal de ${product.name}`} fill sizes="180px" />
                    </div>

                    <label className="field full">
                      <span>Imagen principal</span>
                      <select name="selectedImage" defaultValue={product.image}>
                        {(product.images?.length ? product.images : [product.image]).map((image) => (
                          <option key={image} value={image}>{image.split("/").pop()}</option>
                        ))}
                      </select>
                    </label>

                    <label className="field full">
                      <span>Subir nuevas fotos</span>
                      <input type="file" name="images" accept="image/jpeg,image/png,image/webp" multiple />
                    </label>

                    <div className="admin-thumb-grid">
                      {(product.images?.length ? product.images : [product.image]).slice(0, 8).map((image) => (
                        <div className="admin-thumb" key={image}>
                          <Image src={image} alt="" fill sizes="60px" />
                        </div>
                      ))}
                    </div>

                    <button className="btn btn-outline btn-block" type="submit">Actualizar imágenes</button>
                  </form>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2>Pedidos</h2>
                <p>Marca el estado de cada cliente y prepara el envío.</p>
              </div>
              <strong>{orders.length} pedidos</strong>
            </div>

            <div className="admin-status-guide" aria-label="Guía de estados">
              <span>1. Esperando comprobante</span>
              <span>2. Pago confirmado</span>
              <span>3. Preparando envío</span>
              <span>4. Pedido enviado</span>
            </div>

            <div className="admin-order-list">
              {orders.length === 0 ? (
                <p className="admin-empty">Todavía no hay pedidos.</p>
              ) : (
                orders.map((order) => (
                  <article key={order.id} className="admin-order-card">
                    <div className="admin-order-top">
                      <div>
                        <h3>{order.reference}</h3>
                        <p>{order.customer.firstName} {order.customer.lastName}</p>
                      </div>
                      <span className={`admin-status-pill status-${order.status.toLowerCase().replace(/_/g, "-")}`}>{STATUS_LABELS[order.status] ?? order.status}</span>
                    </div>

                    <div className="admin-order-meta">
                      <span>{order.paymentProvider === "transfer" ? "Transferencia" : "Mercado Pago"}</span>
                      <span>{order.customer.phone}</span>
                      <span>{order.customer.city}, {order.customer.department}</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>

                    <ul className="admin-order-items">
                      {order.items.map((item) => (
                        <li key={`${order.id}-${item.productId}`}>
                          {item.quantity} x {item.productName}
                        </li>
                      ))}
                    </ul>

                    <p className="admin-order-address">{order.shipping}</p>

                    <form className="admin-order-status-form" action={`/api/admin/orders/${order.reference}`} method="post">
                      <label className="field full">
                        <span>Estado del pedido</span>
                        <select name="status" defaultValue={order.status}>
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>{STATUS_LABELS[status] ?? status}</option>
                          ))}
                        </select>
                      </label>
                      <p className="admin-status-help">{STATUS_HELP[order.status] ?? "Actualiza el estado según avance la compra."}</p>
                      <button className="btn btn-outline btn-block" type="submit">Actualizar estado</button>
                    </form>

                    {STORE_CONFIG.whatsapp ? (
                      <a className="btn btn-green btn-block" href={buildWhatsAppOrderLink(order, STORE_CONFIG.whatsapp)} target="_blank" rel="noreferrer">
                        WhatsApp
                      </a>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
