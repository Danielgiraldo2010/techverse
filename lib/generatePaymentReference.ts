import crypto from "node:crypto";

export function generatePaymentReference(prefix = "TV"): string {
  const datePart = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const randomPart = crypto.randomBytes(4).toString("hex");

  return `${prefix}-${datePart}-${randomPart}`;
}