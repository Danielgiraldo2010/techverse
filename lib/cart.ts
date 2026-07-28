import { getProductById, type Product } from "@/data/products";

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface CartResolvedLine {
  product: Product;
  quantity: number;
  lineTotal: number;
}

export function resolveCartLines(items: CartLine[], products?: Product[]): CartResolvedLine[] {
  return items
    .map((item) => {
      const product = products?.find((entry) => entry.id === item.productId) ?? getProductById(item.productId);

      if (!product || !product.active) {
        return null;
      }

      const quantity = Math.max(1, Math.min(item.quantity, product.stock));

      return {
        product,
        quantity,
        lineTotal: product.price * quantity
      };
    })
    .filter((line): line is CartResolvedLine => Boolean(line));
}

export function calculateCartTotals(items: CartLine[], products?: Product[]) {
  const lines = resolveCartLines(items, products);
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const quantity = lines.reduce((sum, line) => sum + line.quantity, 0);

  return { lines, subtotal, quantity };
}
