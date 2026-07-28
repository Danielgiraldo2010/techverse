import { NextResponse } from "next/server";

import { calculateCartTotals } from "@/lib/cart";
import { paymentCreateSchema } from "@/lib/checkoutValidation";
import { TRANSFER_PAYMENT_CONFIG } from "@/lib/constants";
import { generatePaymentReference } from "@/lib/generatePaymentReference";
import { createStoredOrder } from "@/lib/orders";
import { getActiveCatalogProducts } from "@/lib/catalog";

function buildTransferWhatsAppUrl(input: {
  reference: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    department: string;
    city: string;
    address: string;
    extraInfo?: string;
    notes?: string;
  };
  items: Array<{ product: { name: string }; quantity: number }>;
  total: number;
}) {
  const accountLines = TRANSFER_PAYMENT_CONFIG.accounts.map((account) => `${account.name}: ${account.account}`).join("\n");
  const itemLines = input.items.map((item) => `- ${item.quantity} x ${item.product.name}`).join("\n");
  const message = [
    `Hola, quiero confirmar mi pedido ${input.reference}.`,
    "",
    `Cliente: ${input.customer.firstName} ${input.customer.lastName}`,
    `Celular: ${input.customer.phone}`,
    `Direccion: ${input.customer.address}, ${input.customer.city}, ${input.customer.department}`,
    input.customer.extraInfo ? `Info adicional: ${input.customer.extraInfo}` : null,
    "",
    "Productos:",
    itemLines,
    "",
    `Total a transferir: $${input.total.toLocaleString("es-CO")}`,
    "",
    "Cuentas disponibles:",
    accountLines,
    "",
    "Te envio el comprobante por este chat para coordinar el despacho.",
    input.customer.notes ? `Notas: ${input.customer.notes}` : null
  ].filter(Boolean);

  return `https://wa.me/${TRANSFER_PAYMENT_CONFIG.whatsapp}?text=${encodeURIComponent(message.join("\n"))}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = paymentCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Los datos del carrito o del formulario no son válidos.",
        issues: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const activeProducts = await getActiveCatalogProducts();
  const lookupProduct = (productId: string) => activeProducts.find((product) => product.id === productId);
  const resolvedItems = parsed.data.items
    .map((item) => {
      const product = lookupProduct(item.productId);

      if (!product || item.quantity > product.stock) {
        return null;
      }

      return { product, quantity: item.quantity };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (resolvedItems.length !== parsed.data.items.length) {
    return NextResponse.json(
      {
        message: "Uno o más productos no están disponibles en la cantidad solicitada."
      },
      { status: 400 }
    );
  }

  const totals = calculateCartTotals(parsed.data.items, activeProducts);
  const reference = generatePaymentReference("TR");
  const shipping = `${parsed.data.customer.address}, ${parsed.data.customer.city}, ${parsed.data.customer.department}`;
  const order = await createStoredOrder({
    reference,
    customer: parsed.data.customer,
    items: parsed.data.items,
    shipping,
    paymentProvider: "transfer",
    products: activeProducts
  });

  return NextResponse.json({
    reference: order.reference,
    whatsappUrl: buildTransferWhatsAppUrl({
      reference,
      customer: parsed.data.customer,
      items: resolvedItems,
      total: totals.subtotal
    }),
    accounts: TRANSFER_PAYMENT_CONFIG.accounts,
    summary: {
      subtotal: totals.subtotal,
      totalItems: totals.quantity,
      reference
    }
  });
}
