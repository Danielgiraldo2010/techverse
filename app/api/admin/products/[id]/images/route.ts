import fs from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getCatalogProductById, updateCatalogProduct } from "@/lib/catalog";

const MAX_IMAGE_SIZE = 6 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"]
]);

function sanitizeFilePart(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminAuthenticated()) {
    return NextResponse.redirect(new URL("/admin?error=auth", request.url), { status: 303 });
  }

  const { id } = await params;
  const product = await getCatalogProductById(id);

  if (!product) {
    return NextResponse.redirect(new URL("/admin?error=missing", request.url), { status: 303 });
  }

  const formData = await request.formData();
  const selectedImage = String(formData.get("selectedImage") ?? "").trim();
  const files = formData.getAll("images").filter((file): file is File => file instanceof File && file.size > 0);
  const nextImages = [...(product.images?.length ? product.images : [product.image])].filter(Boolean);

  for (const file of files) {
    const extension = ALLOWED_IMAGE_TYPES.get(file.type);

    if (!extension || file.size > MAX_IMAGE_SIZE) {
      return NextResponse.redirect(new URL("/admin?error=image", request.url), { status: 303 });
    }

    const uploadDir = path.join(process.cwd(), "public", "product-photos", product.slug, "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const baseName = sanitizeFilePart(file.name.replace(/\.[^.]+$/, "")) || "foto";
    const fileName = `${Date.now()}-${baseName}.${extension}`;
    const diskPath = path.join(uploadDir, fileName);
    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(diskPath, bytes);

    nextImages.push(`/product-photos/${product.slug}/uploads/${fileName}`);
  }

  const selectedImageExists = selectedImage && nextImages.includes(selectedImage);
  const primaryImage = selectedImageExists ? selectedImage : nextImages[0] ?? product.image;
  const orderedImages = [primaryImage, ...nextImages.filter((image) => image !== primaryImage)];
  const updated = await updateCatalogProduct(id, {
    image: primaryImage,
    images: orderedImages
  });

  if (!updated) {
    return NextResponse.redirect(new URL("/admin?error=missing", request.url), { status: 303 });
  }

  return NextResponse.redirect(new URL("/admin?updated=images", request.url), { status: 303 });
}
