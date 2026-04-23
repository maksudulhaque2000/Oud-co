import { NewProductInput, Product, ProductCategory } from "@/types/product";

const STORAGE_KEY = "oud_co_custom_products_v1";
const OVERRIDES_KEY = "oud_co_product_overrides_v1";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80";

export const categories: ProductCategory[] = ["Oud", "Rose", "Musk", "Oriental", "Floral", "Woody"];

export const staticProducts: Product[] = [
  {
    id: "1",
    title: "Royal Oud Al-Maliki",
    shortDescription: "A rich and deep oud fragrance with a regal signature.",
    fullDescription:
      "Royal Oud Al-Maliki opens with smoky agarwood and settles into amber and sandalwood for a majestic, long-wearing trail suited for evening wear and special gatherings.",
    category: "Oud",
    price: 1850,
    imageUrl:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    volume: "12ml",
    origin: "Saudi Arabia",
    longevity: "12-16 hours",
    notes: "Oud, Amber, Sandalwood",
  },
  {
    id: "2",
    title: "Taif Rose Elixir",
    shortDescription: "Velvety rose oil with bright floral elegance.",
    fullDescription:
      "Taif Rose Elixir blends fresh rose petals with soft musk undertones, creating a refined floral profile that transitions gracefully from daytime to evening.",
    category: "Rose",
    price: 1200,
    imageUrl:
      "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    volume: "10ml",
    origin: "Taif, KSA",
    longevity: "8-12 hours",
    notes: "Taif Rose, White Musk, Vanilla",
  },
  {
    id: "3",
    title: "Black Musk Noir",
    shortDescription: "Dark, smooth musk with woody depth.",
    fullDescription:
      "Black Musk Noir is crafted for those who like bold character. It combines black musk with patchouli and cedar for a modern, confident scent profile.",
    category: "Musk",
    price: 950,
    imageUrl:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    volume: "10ml",
    origin: "UAE",
    longevity: "8-10 hours",
    notes: "Black Musk, Patchouli, Cedar",
  },
  {
    id: "4",
    title: "Amber Oriental",
    shortDescription: "Warm amber wrapped in exotic spice.",
    fullDescription:
      "Amber Oriental delivers a warm and inviting blend of amber resin, saffron, and tonka, giving a luxurious oriental signature with lasting depth.",
    category: "Oriental",
    price: 1450,
    imageUrl:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    volume: "12ml",
    origin: "Oman",
    longevity: "10-14 hours",
    notes: "Amber, Saffron, Tonka",
  },
  {
    id: "5",
    title: "Jasmine Dream",
    shortDescription: "Soft floral sweetness with a clean finish.",
    fullDescription:
      "Jasmine Dream features radiant jasmine sambac enhanced by citrus sparkle and gentle white woods, perfect for everyday elegance.",
    category: "Floral",
    price: 780,
    imageUrl:
      "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=1200&q=80",
    rating: 4.5,
    volume: "8ml",
    origin: "Egypt",
    longevity: "6-9 hours",
    notes: "Jasmine, Neroli, White Woods",
  },
  {
    id: "6",
    title: "Sandalwood Serenity",
    shortDescription: "Creamy sandalwood with meditative calm.",
    fullDescription:
      "Sandalwood Serenity layers premium sandalwood with cardamom and soft amber for a tranquil woody composition loved by both men and women.",
    category: "Woody",
    price: 1100,
    imageUrl:
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    volume: "10ml",
    origin: "India",
    longevity: "9-12 hours",
    notes: "Sandalwood, Cardamom, Amber",
  },
];

function canUseStorage() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function isValidImageSource(value: string) {
  const src = value.trim();
  if (!src) {
    return false;
  }

  if (src.startsWith("data:image/")) {
    return true;
  }

  if (src.startsWith("/")) {
    return true;
  }

  try {
    const parsed = new URL(src);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeImageSource(value?: string) {
  const src = value?.trim() ?? "";
  return isValidImageSource(src) ? src : DEFAULT_IMAGE;
}

function sanitizeProductImage(product: Product): Product {
  return {
    ...product,
    imageUrl: normalizeImageSource(product.imageUrl),
  };
}

function upsertProduct(list: Product[], product: Product): Product[] {
  const index = list.findIndex((item) => item.id === product.id);
  if (index === -1) {
    return [product, ...list];
  }

  const next = [...list];
  next[index] = product;
  return next;
}

function getProductOverrides(): Record<string, Product> {
  const overrides = readJson<Record<string, Product>>(OVERRIDES_KEY, {});
  return overrides && typeof overrides === "object" ? overrides : {};
}

function setCustomProducts(products: Product[]) {
  writeJson(STORAGE_KEY, products);
}

function setProductOverrides(overrides: Record<string, Product>) {
  writeJson(OVERRIDES_KEY, overrides);
}

export function getCustomProducts(): Product[] {
  const products = readJson<Product[]>(STORAGE_KEY, []);
  return Array.isArray(products) ? products : [];
}

export function isCustomProductId(id: string) {
  return id.startsWith("custom-");
}

export function isStaticProductId(id: string) {
  return staticProducts.some((product) => product.id === id);
}

export function getAllProducts(): Product[] {
  const customProducts = getCustomProducts();
  const overrides = getProductOverrides();

  const mergedStaticProducts = staticProducts.map((product) => {
    const override = overrides[product.id];
    const merged = override ? { ...product, ...override, id: product.id } : product;
    return sanitizeProductImage(merged);
  });

  return [...customProducts.map(sanitizeProductImage), ...mergedStaticProducts];
}

export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((product) => product.id === id);
}

export function addCustomProduct(input: NewProductInput): Product {
  const products = getCustomProducts();
  const next: Product = {
    id: `custom-${Date.now()}`,
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
  };

  setCustomProducts(upsertProduct(products, next));
  return next;
}

export function updateProduct(product: Product): Product {
  const nextProduct = sanitizeProductImage(product);

  if (isCustomProductId(product.id)) {
    const products = getCustomProducts();
    setCustomProducts(upsertProduct(products, nextProduct));
    return nextProduct;
  }

  const overrides = getProductOverrides();
  setProductOverrides({
    ...overrides,
    [product.id]: nextProduct,
  });

  return nextProduct;
}

export function deleteProduct(id: string): void {
  if (isCustomProductId(id)) {
    const products = getCustomProducts();
    setCustomProducts(products.filter((product) => product.id !== id));
    return;
  }

  const overrides = getProductOverrides();
  if (overrides[id]) {
    const nextOverrides = { ...overrides };
    delete nextOverrides[id];
    setProductOverrides(nextOverrides);
  }
}

export function removeCustomProduct(id: string): void {
  deleteProduct(id);
}

export function createProductImagePreview(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
        return;
      }

      reject(new Error("Unable to read image file."));
    };

    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
}

export function getProductFormDefaults(product?: Product | null) {
  return {
    title: product?.title ?? "",
    shortDescription: product?.shortDescription ?? "",
    fullDescription: product?.fullDescription ?? "",
    category: product?.category ?? categories[0],
    price: product ? String(product.price) : "",
    imageUrl: product?.imageUrl ?? "",
  };
}
