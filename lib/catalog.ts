import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import { products as seededProducts, type Product } from "@/data/products";

const CATALOG_FILE = path.join(process.cwd(), "data", "catalog.json");

async function ensureCatalogFile() {
  await fs.mkdir(path.dirname(CATALOG_FILE), { recursive: true });

  try {
    await fs.access(CATALOG_FILE);
  } catch {
    await fs.writeFile(CATALOG_FILE, `${JSON.stringify(seededProducts, null, 2)}\n`, "utf8");
  }
}

async function readCatalogFile(): Promise<Product[]> {
  await ensureCatalogFile();
  const raw = await fs.readFile(CATALOG_FILE, "utf8");

  try {
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeCatalogFile(products: Product[]) {
  await ensureCatalogFile();
  await fs.writeFile(CATALOG_FILE, `${JSON.stringify(products, null, 2)}\n`, "utf8");
}

export async function listCatalogProducts() {
  return readCatalogFile();
}

export async function getCatalogProductById(id: string) {
  const products = await readCatalogFile();
  return products.find((product) => product.id === id);
}

export async function getActiveCatalogProducts() {
  const products = await readCatalogFile();
  return products.filter((product) => product.active);
}

export async function updateCatalogProduct(
  id: string,
  patch: Partial<Pick<Product, "price" | "previousPrice" | "stock" | "active" | "featured" | "image" | "images">>
) {
  const products = await readCatalogFile();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return null;
  }

  const nextProduct = {
    ...products[index],
    ...patch
  };

  products[index] = nextProduct;
  await writeCatalogFile(products);

  return nextProduct;
}
