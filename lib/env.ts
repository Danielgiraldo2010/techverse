import "server-only";

import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_STORE_NAME: z.string().min(1).default("TECHVERSE"),
  NEXT_PUBLIC_STORE_WHATSAPP: z.string().optional().default(""),
  NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY: z.string().optional().default(""),
  MERCADOPAGO_ACCESS_TOKEN: z.string().optional().default(""),
  MERCADOPAGO_WEBHOOK_SECRET: z.string().optional().default(""),
  NEXT_PUBLIC_WOMPI_PUBLIC_KEY: z.string().optional().default(""),
  WOMPI_INTEGRITY_SECRET: z.string().optional().default(""),
  WOMPI_PRIVATE_KEY: z.string().optional().default(""),
  WOMPI_ENVIRONMENT: z.enum(["sandbox", "production"]).default("sandbox"),
  ADMIN_PASSWORD_HASH: z.string().optional().default(""),
  ADMIN_SESSION_SECRET: z.string().optional().default("")
});

export const env = envSchema.parse(process.env);

export const hasMercadoPagoSecrets = Boolean(env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY && env.MERCADOPAGO_ACCESS_TOKEN);
export const hasWompiSecrets = Boolean(env.WOMPI_INTEGRITY_SECRET && env.WOMPI_PRIVATE_KEY && env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY);