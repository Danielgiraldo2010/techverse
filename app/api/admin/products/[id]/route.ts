import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/adminAuth";
import { updateCatalogProduct } from "@/lib/catalog";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminAuthenticated()) {
    return NextResponse.redirect(new URL("/admin?error=auth", request.url), { status: 303 });
  }

  const { id } = await params;
  const formData = await request.formData();
  const price = Number(formData.get("price"));
  const previousPriceText = String(formData.get("previousPrice") ?? "").trim();
  const previousPrice = previousPriceText ? Number(previousPriceText) : undefined;
  const stock = Number(formData.get("stock"));
  const active = formData.get("active") === "on";
  const featured = formData.get("featured") === "on";

  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(stock) || stock < 0 || (previousPriceText && (!Number.isFinite(previousPrice) || (previousPrice ?? 0) <= 0))) {
    return NextResponse.redirect(new URL("/admin?error=product", request.url), { status: 303 });
  }

  const updated = await updateCatalogProduct(id, {
    price,
    previousPrice,
    stock: Math.floor(stock),
    active,
    featured
  });

  if (!updated) {
    return NextResponse.redirect(new URL("/admin?error=missing", request.url), { status: 303 });
  }

  return NextResponse.redirect(new URL("/admin?updated=product", request.url), { status: 303 });
}
