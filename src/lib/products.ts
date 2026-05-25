import { NewProductInput, Product, ProductCategory } from "@/types/product";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80";

export const categories: ProductCategory[] = ["Oud", "Rose", "Musk", "Oriental", "Floral", "Woody"];

export function normalizeImageSource(value?: string) {
  const src = value?.trim() ?? "";

  if (!src) {
    return DEFAULT_IMAGE;
  }

  if (src.startsWith("data:image/") || src.startsWith("/")) {
    return src;
  }

  try {
    const parsed = new URL(src);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? src : DEFAULT_IMAGE;
  } catch {
    return DEFAULT_IMAGE;
  }
}

export function isValidImageSource(value: string) {
  const src = value.trim();
  if (!src) {
    return false;
  }

  return normalizeImageSource(src) === src;
}

export function sanitizeProductImage(product: Product): Product {
  return {
    ...product,
    imageUrl: normalizeImageSource(product.imageUrl),
    vatPercent: product.vatPercent ?? 0,
    discountPercent: product.discountPercent ?? 0,
    shippingCharge: product.shippingCharge ?? 0,
  };
}

export function getProductFormDefaults(product?: Product | null) {
  return {
    title: product?.title ?? "",
    shortDescription: product?.shortDescription ?? "",
    fullDescription: product?.fullDescription ?? "",
    category: product?.category ?? categories[0],
    price: product ? String(product.price) : "",
    imageUrl: product?.imageUrl ?? "",
    vatPercent: product ? String(product.vatPercent) : "0",
    discountPercent: product ? String(product.discountPercent) : "0",
    shippingCharge: product ? String(product.shippingCharge) : "0",
  };
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as { error?: string } | null;

  if (!response.ok) {
    throw new Error(payload?.error || "Request failed.");
  }

  return payload as T;
}

function createEmptyProduct(input: NewProductInput, id: string): Product {
  const now = new Date().toISOString();

  return {
    id,
    title: input.title.trim(),
    shortDescription: input.shortDescription.trim(),
    fullDescription: input.fullDescription.trim(),
    category: input.category,
    price: input.price,
    imageUrl: normalizeImageSource(input.imageUrl),
    rating: 4.5,
    volume: "10ml",
    origin: "Bangladesh",
    longevity: "8-10 hours",
    notes: "Custom blend",
    vatPercent: 0,
    discountPercent: 0,
    shippingCharge: 0,
    createdAt: now,
    updatedAt: now,
    publishedByAdminEmail: input.publishedByAdminEmail,
    publishedByAdminUid: input.publishedByAdminUid,
    publishedByAdminName: input.publishedByAdminName,
  };
}

export async function fetchProducts() {
  const payload = await requestJson<{ products: Product[] }>("/api/products");
  return payload.products.map(sanitizeProductImage);
}

export async function getProductById(id: string) {
  const payload = await requestJson<{ product: Product }>(`/api/products/${id}`);
  return sanitizeProductImage(payload.product);
}

export async function addProduct(input: NewProductInput) {
  const tempId = `custom-${Date.now()}`;
  const payload = await requestJson<{ product: Product }>("/api/products", {
    method: "POST",
    body: JSON.stringify({ ...createEmptyProduct(input, tempId), id: tempId }),
  });

  return sanitizeProductImage(payload.product);
}

export async function saveProduct(product: Product) {
  const payload = await requestJson<{ product: Product }>(`/api/products/${product.id}`, {
    method: "PATCH",
    body: JSON.stringify(sanitizeProductImage({ ...product, updatedAt: new Date().toISOString() })),
  });

  return sanitizeProductImage(payload.product);
}

export async function deleteProduct(id: string) {
  await requestJson<{ ok: true }>(`/api/products/${id}`, {
    method: "DELETE",
  });
}