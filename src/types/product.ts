export type ProductCategory = "Oud" | "Rose" | "Musk" | "Oriental" | "Floral" | "Woody";

export type Product = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: ProductCategory;
  price: number;
  imageUrl: string;
  rating: number;
  volume: string;
  origin: string;
  longevity: string;
  notes: string;
  vatPercent: number;
  discountPercent: number;
  shippingCharge: number;
  createdAt?: string;
  updatedAt?: string;
  publishedByAdminEmail?: string;
  publishedByAdminUid?: string;
  publishedByAdminName?: string;
};

export type NewProductInput = {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: ProductCategory;
  price: number;
  imageUrl?: string;
  vatPercent: number;
  discountPercent: number;
  shippingCharge: number;
  publishedByAdminEmail?: string;
  publishedByAdminUid?: string;
  publishedByAdminName?: string;
};
