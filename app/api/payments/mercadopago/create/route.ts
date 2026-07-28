import { NextResponse } from "next/server";

import { calculateCartTotals } from "@/lib/cart";
import { paymentCreateSchema } from "@/lib/checkoutValidation";
import {
  getMercadoPagoAccessToken,
  getMercadoPagoApiBaseUrl,
  getMercadoPagoCheckoutUrl,
  getMercadoPagoNotificationUrl,
  getMercadoPagoReturnUrl,
  getMercadoPagoSafeKeys
} from "@/lib/mercadopago";
import { createStoredOrder } from "@/lib/orders";
import { generatePaymentReference } from "@/lib/generatePaymentReference";
import { getActiveCatalogProducts } from "@/lib/catalog";

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

      if (!product || !activeProducts.some((activeProduct) => activeProduct.id === product.id)) {
        return null;
      }

      if (item.quantity > product.stock) {
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
  const reference = generatePaymentReference("MP");
  const requestOrigin = new URL(request.url).origin;
  const { publicKey, hasMercadoPagoSecrets, accessTokenConfigured } = getMercadoPagoSafeKeys();

  if (!publicKey || !accessTokenConfigured) {
    return NextResponse.json(
      {
        message: "Faltan variables de entorno de Mercado Pago para preparar el checkout.",
        required: ["NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY", "MERCADOPAGO_ACCESS_TOKEN"]
      },
      { status: 503 }
    );
  }

  const preferencePayload = {
    items: resolvedItems.map((item) => ({
      id: item.product.id,
      title: item.product.name,
      description: item.product.shortDescription,
      quantity: item.quantity,
      unit_price: item.product.price,
      currency_id: "COP"
    })),
    payer: {
      name: parsed.data.customer.firstName,
      surname: parsed.data.customer.lastName,
      email: parsed.data.customer.email || undefined,
      phone: {
        number: parsed.data.customer.phone
      },
      address: {
        street_name: parsed.data.customer.address,
        city_name: parsed.data.customer.city,
        state_name: parsed.data.customer.department,
        comment: parsed.data.customer.extraInfo || undefined
      }
    },
    back_urls: {
      success: getMercadoPagoReturnUrl(requestOrigin),
      pending: getMercadoPagoReturnUrl(requestOrigin),
      failure: getMercadoPagoReturnUrl(requestOrigin)
    },
    notification_url: getMercadoPagoNotificationUrl(requestOrigin),
    external_reference: reference,
    metadata: {
      reference,
      customer: parsed.data.customer,
      subtotal: totals.subtotal,
      totalItems: totals.quantity
    },
    statement_descriptor: "TECHVERSE"
  };

  const response = await fetch(`${getMercadoPagoApiBaseUrl()}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getMercadoPagoAccessToken()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(preferencePayload)
  });

  const data = (await response.json().catch(() => null)) as
    | { id?: string; init_point?: string; sandbox_init_point?: string }
    | null;

  if (!response.ok || !data?.id) {
    return NextResponse.json(
      {
        message: "No se pudo crear la preferencia de pago en Mercado Pago.",
        providerStatus: response.status,
        detail: data
      },
      { status: 502 }
    );
  }

  const shipping = `${parsed.data.customer.address}, ${parsed.data.customer.city}, ${parsed.data.customer.department}`;
  await createStoredOrder({
    reference,
    customer: parsed.data.customer,
    items: parsed.data.items,
    shipping,
    products: activeProducts,
    paymentPreferenceId: data.id
  });

  return NextResponse.json({
    preferenceId: data.id,
    checkoutUrl: getMercadoPagoCheckoutUrl(data.id, data.sandbox_init_point, data.init_point),
    initPoint: data.init_point ?? data.sandbox_init_point ?? "",
    sandboxInitPoint: data.sandbox_init_point ?? "",
    publicKey,
    hasMercadoPagoSecrets,
    summary: {
      subtotal: totals.subtotal,
      totalItems: totals.quantity,
      reference
    }
  });
}
