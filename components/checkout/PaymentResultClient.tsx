"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type PaymentStatus = "APPROVED" | "PENDING" | "DECLINED" | "ERROR" | "UNKNOWN";

interface PaymentResultResponse {
  id?: string;
  status: PaymentStatus;
  reference?: string;
  amountInCents?: number;
  message?: string;
}

const STATUS_LABELS: Record<PaymentStatus, string> = {
  APPROVED: "Pago aprobado",
  PENDING: "Pago pendiente",
  DECLINED: "Pago rechazado",
  ERROR: "Error al consultar",
  UNKNOWN: "Estado desconocido"
};

export function PaymentResultClient() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("payment_id") ?? searchParams.get("id") ?? searchParams.get("collection_id") ?? "";
  const [result, setResult] = useState<PaymentResultResponse>({ status: "UNKNOWN" });
  const [loading, setLoading] = useState(Boolean(transactionId));

  useEffect(() => {
    if (!transactionId) {
      setResult({ status: "ERROR", message: "No se encontró el identificador de la transacción." });
      setLoading(false);
      return;
    }

    async function loadStatus() {
      try {
        const response = await fetch(`/api/payments/mercadopago/status?id=${encodeURIComponent(transactionId)}`);
        const data = (await response.json()) as PaymentResultResponse;

        if (!response.ok) {
          throw new Error(data.message ?? "No se pudo consultar el pago");
        }

        setResult(data);
      } catch (error) {
        setResult({ status: "ERROR", message: error instanceof Error ? error.message : "Error al consultar" });
      } finally {
        setLoading(false);
      }
    }

    loadStatus();
  }, [transactionId]);

  const statusClassName = `payment-status payment-status-${result.status.toLowerCase()}`;

  return (
    <div className="container payment-result-card">
      <div className="eyebrow">Resultado del pago</div>
      <h1>{loading ? "Consultando estado..." : STATUS_LABELS[result.status]}</h1>
      <p>{result.message ?? "Verificamos el estado directamente en Mercado Pago para no depender de la redirección del navegador."}</p>

      <div className={statusClassName} aria-live="polite">
        <strong>{STATUS_LABELS[result.status]}</strong>
        {result.reference ? <span>Referencia: {result.reference}</span> : null}
        {typeof result.amountInCents === "number" ? <span>Monto: {result.amountInCents} centavos</span> : null}
        {result.id ? <span>Transacción: {result.id}</span> : null}
      </div>

      <Link className="btn btn-primary" href="/">
        Volver al inicio
      </Link>
    </div>
  );
}