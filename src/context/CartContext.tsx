"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Product } from "@/types/product";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "oudco-cart-v1";

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    vatPercent: product.vatPercent ?? 0,
    discountPercent: product.discountPercent ?? 0,
    shippingCharge: product.shippingCharge ?? 0,
  };
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function clampQuantity(quantity: number) {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return 1;
  }

  return Math.max(1, Math.floor(quantity));
}

function calculateSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

function calculateItemCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const nextItems = JSON.parse(raw) as CartItem[];
        return Array.isArray(nextItems)
          ? nextItems.map((item) => ({ ...item, product: normalizeProduct(item.product) }))
          : [];
      }
    } catch {
      return [];
    }
    return [];
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: calculateItemCount(items),
      subtotal: calculateSubtotal(items),
      addToCart(product: Product, quantity = 1) {
        const nextQuantity = clampQuantity(quantity);
        const normalizedProduct = normalizeProduct(product);
        setItems((current) => {
          const existing = current.find((item) => item.product.id === normalizedProduct.id);

          if (!existing) {
            return [...current, { product: normalizedProduct, quantity: nextQuantity }];
          }

          return current.map((item) =>
            item.product.id === normalizedProduct.id ? { ...item, product: normalizedProduct, quantity: item.quantity + nextQuantity } : item,
          );
        });
      },
      removeFromCart(productId: string) {
        setItems((current) => current.filter((item) => item.product.id !== productId));
      },
      updateQuantity(productId: string, quantity: number) {
        if (quantity <= 1) {
          setItems((current) => current.filter((item) => item.product.id !== productId));
          return;
        }

        const nextQuantity = clampQuantity(quantity);
        setItems((current) => current.map((item) => (item.product.id === productId ? { ...item, quantity: nextQuantity } : item)));
      },
      clearCart() {
        setItems([]);
      },
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
