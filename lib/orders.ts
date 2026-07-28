import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import type { CheckoutCustomerInput } from "@/lib/checkoutValidation";
import type { Product } from "@/data/products";
import type { CartLine } from "@/lib/cart";
import { calculateCartTotals, resolveCartLines } from "@/lib/cart";

export type OrderStatus = "PENDING_PAYMENT" | "PAYMENT_PENDING" | "PAID" | "DECLINED" | "READY" | "SHIPPED" | "CANCELLED";

export interface StoredOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface StoredOrder {
  id: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  paymentProvider: "mercadopago" | "transfer";
  paymentPreferenceId?: string;
  paymentId?: string;
  paymentStatus?: string;
  customer: CheckoutCustomerInput;
  items: StoredOrderItem[];
  subtotal: number;
  totalItems: number;
  total: number;
  shipping: string;
  notes?: string;
}

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

async function ensureOrdersFile() {
  await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true });

  try {
    await fs.access(ORDERS_FILE);
  } catch {
    await fs.writeFile(ORDERS_FILE, "[]\n", "utf8");
  }
}

async function readOrdersFile(): Promise<StoredOrder[]> {
  await ensureOrdersFile();
  const raw = await fs.readFile(ORDERS_FILE, "utf8");

  try {
    const parsed = JSON.parse(raw) as StoredOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeOrdersFile(orders: StoredOrder[]) {
  await ensureOrdersFile();
  await fs.writeFile(ORDERS_FILE, `${JSON.stringify(orders, null, 2)}\n`, "utf8");
}

export function buildStoredOrderItems(items: CartLine[], products?: Product[]) {
  return resolveCartLines(items, products).map((item) => ({
    productId: item.product.id,
    productName: item.product.name,
    quantity: item.quantity,
    unitPrice: item.product.price,
    lineTotal: item.lineTotal
  }));
}

export async function createStoredOrder(input: {
  reference: string;
  customer: CheckoutCustomerInput;
  items: CartLine[];
  shipping: string;
  paymentProvider?: "mercadopago" | "transfer";
  paymentPreferenceId?: string;
  products?: Product[];
}) {
  const resolvedItems = buildStoredOrderItems(input.items, input.products);
  const totals = calculateCartTotals(input.items, input.products);
  const subtotal = totals.subtotal;
  const totalItems = totals.quantity;
  const now = new Date().toISOString();

  const order: StoredOrder = {
    id: crypto.randomUUID(),
    reference: input.reference,
    createdAt: now,
    updatedAt: now,
    status: input.paymentPreferenceId ? "PAYMENT_PENDING" : "PENDING_PAYMENT",
    paymentProvider: input.paymentProvider ?? "mercadopago",
    paymentPreferenceId: input.paymentPreferenceId,
    customer: input.customer,
    items: resolvedItems,
    subtotal,
    totalItems,
    total: subtotal,
    shipping: input.shipping,
    notes: input.customer.notes || undefined
  };

  const orders = await readOrdersFile();
  orders.unshift(order);
  await writeOrdersFile(orders);

  return order;
}

export async function listStoredOrders() {
  return readOrdersFile();
}

export async function findStoredOrderByReference(reference: string) {
  const orders = await readOrdersFile();
  return orders.find((order) => order.reference === reference);
}

export async function findStoredOrderByPaymentId(paymentId: string) {
  const orders = await readOrdersFile();
  return orders.find((order) => order.paymentId === paymentId);
}

export async function updateStoredOrder(reference: string, patch: Partial<StoredOrder>) {
  const orders = await readOrdersFile();
  const index = orders.findIndex((order) => order.reference === reference);

  if (index === -1) {
    return null;
  }

  const nextOrder = {
    ...orders[index],
    ...patch,
    updatedAt: new Date().toISOString()
  };

  orders[index] = nextOrder;
  await writeOrdersFile(orders);

  return nextOrder;
}

export async function setOrderPaymentData(reference: string, paymentData: { paymentPreferenceId?: string; paymentId?: string; paymentStatus?: string; status?: OrderStatus }) {
  return updateStoredOrder(reference, {
    paymentPreferenceId: paymentData.paymentPreferenceId,
    paymentId: paymentData.paymentId,
    paymentStatus: paymentData.paymentStatus,
    status: paymentData.status
  });
}

export function buildWhatsAppOrderLink(order: StoredOrder, phoneNumber: string) {
  const lines = [
    `Hola, te escribo por el pedido ${order.reference}.`,
    `Cliente: ${order.customer.firstName} ${order.customer.lastName}`,
    `Teléfono: ${order.customer.phone}`,
    `Dirección: ${order.customer.address}, ${order.customer.city}, ${order.customer.department}`,
    `Pago: ${order.paymentStatus ?? order.status}`,
    `Productos:`
  ];

  order.items.forEach((item) => {
    lines.push(`- ${item.quantity} x ${item.productName}`);
  });

  lines.push(`Total: $${order.total.toLocaleString("es-CO")}`);
  lines.push(`Notas: ${order.notes || "Sin notas"}`);

  const message = encodeURIComponent(lines.join("\n"));
  const normalizedPhone = phoneNumber.replace(/\D/g, "");

  return `https://wa.me/${normalizedPhone}?text=${message}`;
}
