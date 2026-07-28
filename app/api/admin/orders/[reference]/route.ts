import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/adminAuth";
import { type OrderStatus, updateStoredOrder } from "@/lib/orders";

const ALLOWED_STATUSES: OrderStatus[] = ["PENDING_PAYMENT", "PAYMENT_PENDING", "PAID", "READY", "SHIPPED", "DECLINED", "CANCELLED"];

export async function POST(request: Request, { params }: { params: Promise<{ reference: string }> }) {
  if (!await isAdminAuthenticated()) {
    return NextResponse.redirect(new URL("/admin?error=auth", request.url), { status: 303 });
  }

  const { reference } = await params;
  const formData = await request.formData();
  const status = String(formData.get("status") ?? "").trim() as OrderStatus;

  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.redirect(new URL("/admin?error=status", request.url), { status: 303 });
  }

  const updated = await updateStoredOrder(reference, { status });

  if (!updated) {
    return NextResponse.redirect(new URL("/admin?error=missing-order", request.url), { status: 303 });
  }

  return NextResponse.redirect(new URL("/admin?updated=order", request.url), { status: 303 });
}
