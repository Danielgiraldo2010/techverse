import { NextResponse } from "next/server";

import { paymentStatusQuerySchema } from "@/lib/checkoutValidation";
import { env } from "@/lib/env";
import { getMercadoPagoAccessToken, getMercadoPagoApiBaseUrl } from "@/lib/mercadopago";
import { findStoredOrderByPaymentId, setOrderPaymentData, updateStoredOrder } from "@/lib/orders";

const STATUS_MAP: Record<string, "APPROVED" | "PENDING" | "DECLINED" | "ERROR" | "UNKNOWN"> = {
  approved: "APPROVED",
  pending: "PENDING",
  in_process: "PENDING",
  in_mediation: "PENDING",
  rejected: "DECLINED",
  cancelled: "DECLINED",
  refunded: "DECLINED",
  charged_back: "DECLINED",
  error: "ERROR"
};

function mapPaymentStatusToOrderStatus(status: "APPROVED" | "PENDING" | "DECLINED" | "ERROR" | "UNKNOWN") {
  if (status === "APPROVED") {
    return "PAID" as const;
  }

  if (status === "PENDING" || status === "UNKNOWN") {
    return "PAYMENT_PENDING" as const;
  }

  if (status === "DECLINED" || status === "ERROR") {
    return "DECLINED" as const;
  }

  return "PAYMENT_PENDING" as const;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = paymentStatusQuerySchema.safeParse({ id: url.searchParams.get("id") ?? "" });

  if (!query.success) {
    return NextResponse.json({ status: "ERROR", message: query.error.issues[0]?.message ?? "Falta el identificador de la transacción" }, { status: 400 });
  }

  if (!env.MERCADOPAGO_ACCESS_TOKEN) {
    return NextResponse.json(
      { status: "ERROR", message: "Falta el access token de Mercado Pago para consultar el estado." },
      { status: 503 }
    );
  }

  const response = await fetch(`${getMercadoPagoApiBaseUrl()}/v1/payments/${encodeURIComponent(query.data.id)}`, {
    headers: {
      Authorization: `Bearer ${getMercadoPagoAccessToken()}`
    }
  });

  const data = (await response.json().catch(() => null)) as
    | {
        id?: string | number;
        status?: string;
        external_reference?: string;
        transaction_amount?: number;
        currency_id?: string;
        date_approved?: string;
        status_detail?: string;
      }
    | null;

  if (!response.ok || !data) {
    return NextResponse.json(
      { status: "ERROR", message: "No se pudo consultar el pago en Mercado Pago." },
      { status: 502 }
    );
  }

  const normalizedStatus = String(data.status ?? "unknown").toLowerCase();
  const status = STATUS_MAP[normalizedStatus] ?? "UNKNOWN";
  const paymentId = String(data.id ?? query.data.id);
  const externalReference = data.external_reference ? String(data.external_reference) : undefined;

  if (externalReference) {
    await updateStoredOrder(externalReference, {
      paymentId,
      paymentStatus: String(data.status ?? "unknown"),
      status: mapPaymentStatusToOrderStatus(status)
    });
  } else {
    const order = await findStoredOrderByPaymentId(paymentId);

    if (order) {
      await setOrderPaymentData(order.reference, {
        paymentId,
        paymentStatus: String(data.status ?? "unknown"),
        status: mapPaymentStatusToOrderStatus(status)
      });
    }
  }

  return NextResponse.json({
    id: paymentId,
    status,
    reference: externalReference,
    amountInCents: typeof data.transaction_amount === "number" ? Math.round(data.transaction_amount * 100) : undefined,
    currency: data.currency_id,
    message: data.status_detail ? `Estado en Mercado Pago: ${data.status_detail}` : undefined,
    rawStatus: data.status,
    approvedAt: data.date_approved ?? undefined
  });
}