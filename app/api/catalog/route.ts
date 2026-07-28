import { NextResponse } from "next/server";

import { listCatalogProducts } from "@/lib/catalog";

export async function GET() {
  return NextResponse.json({ products: await listCatalogProducts() });
}
