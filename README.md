# TECHVERSE

Tienda online de audifonos inalambricos con catalogo, carrito, checkout, pagos por Mercado Pago o transferencia, y panel administrativo.

## Stack

- Next.js App Router
- React
- TypeScript
- CSS global
- Zod
- bcryptjs
- `next/image`

## Funciones

- Home de ventas con fotos reales de producto.
- Catalogo editable.
- Carrito persistente en `localStorage`.
- Checkout con datos de envio.
- Pago con tarjeta/debito via Mercado Pago.
- Pago por transferencia con envio de comprobante por WhatsApp.
- Panel admin protegido por contraseña.
- Gestion de precios, stock, estado activo/destacado e imagenes.
- Gestion de pedidos y estados.

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Variables de entorno

Crear `.env.local` usando `.env.example` como base.

Variables principales:

- `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
- `MERCADOPAGO_ACCESS_TOKEN`
- `ADMIN_PASSWORD_HASH`
- `ADMIN_SESSION_SECRET`

`NEXT_PUBLIC_SITE_URL` es opcional. Si no se define, la app usa automaticamente la URL que entrega Vercel; en desarrollo usa `http://localhost:3000`.

No subir `.env.local` al repositorio.

## Build

```bash
npm run build
```

## Nota importante para Vercel

La app compila para Vercel, pero el panel admin actualmente escribe en archivos locales (`data/catalog.json`, `data/orders.json` y `public/product-photos/.../uploads`). En Vercel ese almacenamiento no es persistente para produccion.

Antes de operar ventas reales en Vercel, migrar:

- Productos, precios, stock, pedidos y estados a una base de datos.
- Imagenes subidas desde admin a Vercel Blob, Cloudinary, S3 o similar.

## Admin

La clave se configura con `ADMIN_PASSWORD_HASH`. Genera un hash bcrypt para la contrasena real antes de publicar.
