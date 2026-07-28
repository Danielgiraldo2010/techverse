import crypto from "node:crypto";

import { env, hasWompiSecrets } from "@/lib/env";
import { WOMPI_PATHS } from "@/lib/constants";

export type WompiEnvironment = "sandbox" | "production";

export function getWompiApiBaseUrl(environment: WompiEnvironment = env.WOMPI_ENVIRONMENT): string {
  return environment === "production"
    ? "https://production.wompi.co/v1"
    : "https://api-sandbox.wompi.co/v1";
}

export function buildWompiIntegritySignature(reference: string, amountInCents: number, currency = "COP"): string {
  if (!env.WOMPI_INTEGRITY_SECRET) {
    return "";
  }

  const payload = `${reference}${amountInCents}${currency}${env.WOMPI_INTEGRITY_SECRET}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

export function getWompiCheckoutUrl(): string {
  return WOMPI_PATHS.checkoutUrl;
}

export function getWompiRedirectUrl(): string {
  return `${env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/pago/resultado`;
}

export function getWompiSafeKeys() {
  return {
    publicKey: env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
    hasWompiSecrets,
    environment: env.WOMPI_ENVIRONMENT
  };
}