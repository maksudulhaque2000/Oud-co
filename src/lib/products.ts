import { NewProductInput, Product, ProductCategory } from "@/types/product";

const STORAGE_KEY = "oud_co_custom_products_v1";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80";

export const categories: ProductCategory[] = [
  "Oud",
  "Rose",
  "Musk",
  "Oriental",
  "Floral",
  "Woody",
];

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

export function getCustomProducts(): Product[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setCustomProducts(products: Product[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function getAllProducts(): Product[] {
  return [...getCustomProducts(), ...staticProducts];
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
    imageUrl: input.imageUrl?.trim() || DEFAULT_IMAGE,
    rating: 4.5,
    volume: "10ml",
    origin: "Bangladesh",
    longevity: "8-10 hours",
    notes: "Custom blend",
  };

  setCustomProducts([next, ...products]);
  return next;
}

export function removeCustomProduct(id: string): void {
  const products = getCustomProducts();
  const updated = products.filter((product) => product.id !== id);
  setCustomProducts(updated);
}
