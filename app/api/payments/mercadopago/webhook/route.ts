import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { getMercadoPagoAccessToken, getMercadoPagoApiBaseUrl } from "@/lib/mercadopago";
import { findStoredOrderByPaymentId, setOrderPaymentData } from "@/lib/orders";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const body = await request.json().catch(() => null);
  const paymentId = String(body?.data?.id ?? body?.id ?? url.searchParams.get("data.id") ?? "").trim();

  if (!paymentId) {
    return NextResponse.json({ received: true, message: "Notificación recibida sin identificador de pago." }, { status: 200 });
  }

  if (!env.MERCADOPAGO_ACCESS_TOKEN) {
    return NextResponse.json({ received: true, message: "Webhook recibido, pero falta access token para consultar detalles." }, { status: 200 });
  }

  const response = await fetch(`${getMercadoPagoApiBaseUrl()}/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: {
      Authorization: `Bearer ${getMercadoPagoAccessToken()}`
    }
  });

  const data = await response.json().catch(() => null);

  const order = await findStoredOrderByPaymentId(paymentId);

  if (order) {
    await setOrderPaymentData(order.reference, {
      paymentId,
      paymentStatus: String(data?.status ?? "unknown"),
      status: String(data?.status ?? "unknown").toLowerCase() === "approved" ? "PAID" : order.status
    });
  }

  return NextResponse.json({
    received: true,
    paymentId,
    processed: response.ok,
    status: data?.status ?? "unknown",
    externalReference: data?.external_reference ?? null
  });
}