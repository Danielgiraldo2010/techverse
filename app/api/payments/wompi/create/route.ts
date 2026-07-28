import { NextResponse } from "next/server";

import { paymentCreateSchema } from "@/lib/checkoutValidation";
import { calculateCartTotals } from "@/lib/cart";
import { buildWompiIntegritySignature, getWompiCheckoutUrl, getWompiRedirectUrl, getWompiSafeKeys } from "@/lib/wompi";
import { generatePaymentReference } from "@/lib/generatePaymentReference";
import { getActiveCatalogProducts } from "@/lib/catalog";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = paymentCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Los datos del carrito o del formulario no son válidos.",
        issues: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const activeProducts = await getActiveCatalogProducts();
  const lookupProduct = (productId: string) => activeProducts.find((product) => product.id === productId);
  const resolvedItems = parsed.data.items.map((item) => {
    const product = lookupProduct(item.productId);

    if (!product || !activeProducts.some((activeProduct) => activeProduct.id === product.id)) {
      return null;
    }

    if (item.quantity > product.stock) {
      return null;
    }

    return { product, quantity: item.quantity };
  });

  if (resolvedItems.some((item) => item === null)) {
    return NextResponse.json(
      {
        message: "Uno o más productos no están disponibles en la cantidad solicitada."
      },
      { status: 400 }
    );
  }

  const totals = calculateCartTotals(parsed.data.items, activeProducts);
  const reference = generatePaymentReference();
  const amountInCents = totals.subtotal * 100;
  const signature = buildWompiIntegritySignature(reference, amountInCents, "COP");
  const { publicKey } = getWompiSafeKeys();

  if (!publicKey || !signature) {
    return NextResponse.json(
      {
        message: "Faltan variables de entorno de Wompi para preparar el checkout.",
        required: ["NEXT_PUBLIC_WOMPI_PUBLIC_KEY", "WOMPI_INTEGRITY_SECRET", "WOMPI_PRIVATE_KEY"]
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    checkoutUrl: getWompiCheckoutUrl(),
    payload: {
      "public-key": publicKey,
      currency: "COP",
      "amount-in-cents": String(amountInCents),
      reference,
      "signature:integrity": signature,
      "redirect-url": getWompiRedirectUrl()
    },
    summary: {
      subtotal: totals.subtotal,
      totalItems: totals.quantity,
      reference
    }
  });
}
