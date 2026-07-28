import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { paymentStatusQuerySchema } from "@/lib/checkoutValidation";
import { getWompiApiBaseUrl } from "@/lib/wompi";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = paymentStatusQuerySchema.safeParse({ id: url.searchParams.get("id") ?? "" });

  if (!query.success) {
    return NextResponse.json({ status: "ERROR", message: "Falta el identificador de la transacción." }, { status: 400 });
  }

  if (!env.WOMPI_PRIVATE_KEY) {
    return NextResponse.json(
      { status: "ERROR", message: "Falta la llave privada de Wompi para consultar el estado." },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(`${getWompiApiBaseUrl()}/transactions/${encodeURIComponent(query.data.id)}`, {
      headers: {
        Authorization: `Bearer ${env.WOMPI_PRIVATE_KEY}`,
        Accept: "application/json"
      },
      cache: "no-store"
    });

    const data = (await response.json().catch(() => null)) as
      | { data?: { status?: string; reference?: string; amount_in_cents?: number } }
      | null;

    if (!response.ok || !data?.data) {
      return NextResponse.json(
        { status: "ERROR", message: "No se pudo consultar la transacción en Wompi." },
        { status: 502 }
      );
    }

    const wompiStatus = String(data.data.status ?? "UNKNOWN").toUpperCase();
    const status = wompiStatus === "APPROVED" || wompiStatus === "PENDING" || wompiStatus === "DECLINED" ? wompiStatus : "UNKNOWN";

    return NextResponse.json({
      id: query.data.id,
      status,
      reference: data.data.reference,
      amountInCents: data.data.amount_in_cents
    });
  } catch {
    return NextResponse.json({ status: "ERROR", message: "Error al consultar el pago." }, { status: 502 });
  }
}