import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

import { env } from "@/lib/env";

export const ADMIN_SESSION_COOKIE = "techverse-admin-session";
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function getSessionSecret() {
  return env.ADMIN_SESSION_SECRET;
}

function signExpiry(expiry: number) {
  return createHmac("sha256", getSessionSecret()).update(String(expiry)).digest("hex");
}

export function createAdminSessionValue() {
  const expiry = Date.now() + ADMIN_SESSION_TTL_MS;
  return `${expiry}.${signExpiry(expiry)}`;
}

export function isAdminSessionValueValid(value?: string | null) {
  if (!value || !getSessionSecret()) {
    return false;
  }

  const [expiryText, signature] = value.split(".");
  const expiry = Number(expiryText);

  if (!Number.isFinite(expiry) || !signature || Date.now() > expiry) {
    return false;
  }

  const expectedSignature = signExpiry(expiry);

  if (signature.length !== expectedSignature.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

export async function isAdminAuthenticated() {
  return isAdminSessionValueValid((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
}
