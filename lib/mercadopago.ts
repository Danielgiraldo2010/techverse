import { env, hasMercadoPagoSecrets } from "@/lib/env";

export function getMercadoPagoApiBaseUrl(): string {
  return "https://api.mercadopago.com";
}

export function getMercadoPagoPublicKey(): string {
  return env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
}

export function getMercadoPagoAccessToken(): string {
  return env.MERCADOPAGO_ACCESS_TOKEN;
}

export function getMercadoPagoReturnUrl(baseUrl?: string): string {
  const origin = (baseUrl ?? env.NEXT_PUBLIC_SITE_URL).replace(/\/$/, "");
  return `${origin}/pago/resultado`;
}

export function getMercadoPagoNotificationUrl(baseUrl?: string): string {
  const origin = (baseUrl ?? env.NEXT_PUBLIC_SITE_URL).replace(/\/$/, "");
  return `${origin}/api/payments/mercadopago/webhook`;
}

export function getMercadoPagoCheckoutUrl(preferenceId: string, sandboxInitPoint?: string, initPoint?: string): string {
  if (env.MERCADOPAGO_ACCESS_TOKEN.startsWith("TEST-") && sandboxInitPoint) {
    return sandboxInitPoint;
  }

  return initPoint ?? sandboxInitPoint ?? `https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=${encodeURIComponent(preferenceId)}`;
}

export function getMercadoPagoSafeKeys() {
  return {
    publicKey: getMercadoPagoPublicKey(),
    hasMercadoPagoSecrets,
    accessTokenConfigured: Boolean(env.MERCADOPAGO_ACCESS_TOKEN)
  };
}