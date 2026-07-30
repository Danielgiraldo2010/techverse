import "server-only";

import { z } from "zod";

function getDefaultSiteUrl() {
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default(getDefaultSiteUrl()),
  NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY: z.string().optional().default(""),
  MERCADOPAGO_ACCESS_TOKEN: z.string().optional().default(""),
  ADMIN_PASSWORD_HASH: z.string().optional().default(""),
  ADMIN_SESSION_SECRET: z.string().optional().default("")
});

export const env = envSchema.parse(process.env);

export const hasMercadoPagoSecrets = Boolean(env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY && env.MERCADOPAGO_ACCESS_TOKEN);
