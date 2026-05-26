"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
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
const listeners = new Set<() => void>();
let cachedRawCart: string | null = null;
let cachedItems: CartItem[] = [];
const EMPTY_CART_ITEMS: CartItem[] = [];

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

function readCartItems(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (raw === cachedRawCart) {
      return cachedItems;
    }

    if (!raw) {
      cachedRawCart = raw;
      cachedItems = [];
      return cachedItems;
    }

    const nextItems = JSON.parse(raw) as CartItem[];
    cachedRawCart = raw;
    cachedItems = Array.isArray(nextItems)
      ? nextItems.map((item) => ({ ...item, product: normalizeProduct(item.product) }))
      : [];
    return cachedItems;
  } catch {
    cachedRawCart = null;
    cachedItems = [];
    return cachedItems;
  }
}

function writeCartItems(nextItems: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedItems = nextItems.map((item) => ({ ...item, product: normalizeProduct(item.product) }));
  const nextRaw = JSON.stringify(normalizedItems);
  cachedRawCart = nextRaw;
  cachedItems = normalizedItems;
  window.localStorage.setItem(STORAGE_KEY, nextRaw);
  listeners.forEach((listener) => listener());
}

function updateCartItems(updater: CartItem[] | ((current: CartItem[]) => CartItem[])) {
  const currentItems = readCartItems();
  const nextItems = typeof updater === "function" ? updater(currentItems) : updater;
  writeCartItems(nextItems);
}

function subscribeCart(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribeCart, readCartItems, () => EMPTY_CART_ITEMS);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: calculateItemCount(items),
      subtotal: calculateSubtotal(items),
      addToCart(product: Product, quantity = 1) {
        const nextQuantity = clampQuantity(quantity);
        const normalizedProduct = normalizeProduct(product);
        updateCartItems((current) => {
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
        updateCartItems((current) => current.filter((item) => item.product.id !== productId));
      },
      updateQuantity(productId: string, quantity: number) {
        if (quantity <= 1) {
          updateCartItems((current) => current.filter((item) => item.product.id !== productId));
          return;
        }

        const nextQuantity = clampQuantity(quantity);
        updateCartItems((current) => current.map((item) => (item.product.id === productId ? { ...item, quantity: nextQuantity } : item)));
      },
      clearCart() {
        writeCartItems([]);
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
