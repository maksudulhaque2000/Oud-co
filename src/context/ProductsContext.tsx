"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { addProduct as createProductRecord, deleteProduct as removeProductRecord, fetchProducts, saveProduct as saveProductRecord } from "@/lib/products";
import { NewProductInput, Product } from "@/types/product";

type ProductsContextValue = {
  products: Product[];
  loading: boolean;
  error: string | null;
  getProductById: (id: string) => Product | undefined;
  addProduct: (input: NewProductInput) => Promise<Product>;
  saveProduct: (product: Product) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
};

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

function upsertProduct(list: Product[], product: Product) {
  const index = list.findIndex((item) => item.id === product.id);

  if (index === -1) {
    return [product, ...list];
  }

  const next = [...list];
  next[index] = product;
  return next;
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const { canManageProducts } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const nextProducts = await fetchProducts();

        if (!active) {
          return;
        }

        setProducts(nextProducts);
        setLoading(false);
        setError(null);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setProducts([]);
        setError(loadError instanceof Error ? loadError.message : "Unable to load products.");
        setLoading(false);
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<ProductsContextValue>(
    () => ({
      products,
      loading,
      error,
      getProductById(id: string) {
        return products.find((product) => product.id === id);
      },
      async addProduct(input: NewProductInput) {
        if (!canManageProducts) {
          throw new Error("You are not allowed to add products.");
        }

        const createdProduct = await createProductRecord(input);
        setProducts((current) => upsertProduct(current, createdProduct));
        return createdProduct;
      },
      async saveProduct(product: Product) {
        if (!canManageProducts) {
          throw new Error("You are not allowed to edit products.");
        }

        const savedProduct = await saveProductRecord(product);
        setProducts((current) => upsertProduct(current, savedProduct));
        return savedProduct;
      },
      async deleteProduct(id: string) {
        if (!canManageProducts) {
          throw new Error("You are not allowed to delete products.");
        }

        await removeProductRecord(id);
        setProducts((current) => current.filter((product) => product.id !== id));
      },
    }),
    [canManageProducts, error, loading, products],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductsProvider");
  }

  return context;
}