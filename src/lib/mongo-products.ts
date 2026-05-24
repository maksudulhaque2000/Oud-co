import { randomUUID } from "node:crypto";
import { Collection } from "mongodb";
import { Product } from "@/types/product";
import { getMongoDb } from "@/lib/mongodb";
import { sanitizeProductImage } from "@/lib/products";

const COLLECTION_NAME = "products";

type ProductDocument = Product & { _id: string };

function toProduct(document: ProductDocument): Product {
  const { _id, ...rest } = document;
  return sanitizeProductImage({
    ...rest,
    id: rest.id || _id,
  });
}

async function getProductsCollection(): Promise<Collection<ProductDocument>> {
  const db = await getMongoDb();
  return db.collection<ProductDocument>(COLLECTION_NAME);
}

export async function listProducts() {
  const collection = await getProductsCollection();
  const products = await collection.find().sort({ createdAt: -1 }).toArray();
  return products.map(toProduct);
}

export async function getProduct(id: string) {
  const collection = await getProductsCollection();
  const product = await collection.findOne({ _id: id });
  return product ? toProduct(product) : null;
}

export type ProductInput = Pick<
  Product,
  "id" | "title" | "shortDescription" | "fullDescription" | "category" | "price" | "imageUrl" | "rating" | "volume" | "origin" | "longevity" | "notes"
> & {
  createdAt?: string;
  updatedAt?: string;
};

export async function createProduct(input: ProductInput) {
  const collection = await getProductsCollection();
  const now = new Date().toISOString();
  const product: ProductDocument = sanitizeProductImage({
    ...input,
    id: input.id || randomUUID(),
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  }) as ProductDocument;

  product._id = product.id;
  await collection.insertOne(product);
  return toProduct(product);
}

export async function updateProduct(id: string, input: ProductInput) {
  const collection = await getProductsCollection();
  const existing = await collection.findOne({ _id: id });

  const now = new Date().toISOString();
  const next: ProductDocument = {
    ...(existing ?? { _id: id, id }),
    ...sanitizeProductImage({
      ...(existing ?? ({} as Product)),
      ...input,
      id,
      createdAt: existing?.createdAt ?? input.createdAt ?? now,
      updatedAt: input.updatedAt ?? now,
    }),
    _id: id,
    id,
  };

  await collection.updateOne({ _id: id }, { $set: next }, { upsert: true });
  return toProduct(next);
}

export async function deleteProduct(id: string) {
  const collection = await getProductsCollection();
  await collection.deleteOne({ _id: id });
}
