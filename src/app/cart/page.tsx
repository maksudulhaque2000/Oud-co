"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { normalizeImageSource } from "@/lib/products";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <h1 className="text-3xl font-bold text-[#f5e6c2]">Your Cart</h1>
      <p className="mt-2 text-sm text-[#dccba6]">Review the products you want to purchase and continue to checkout.</p>

      {items.length === 0 ? (
        <p className="mt-8 rounded-lg border border-[#d6b36a]/25 bg-[#130e0a] p-6 text-[#dccba6]">No items in cart yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-4">
            {items.map((item) => (
              <article key={item.product.id} className="flex gap-4 rounded-2xl border border-[#d6b36a]/20 bg-[#130e0a] p-4">
                <img src={normalizeImageSource(item.product.imageUrl)} alt={item.product.title} className="h-24 w-24 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-semibold text-[#f8ecd0]">{item.product.title}</h2>
                  <p className="text-sm text-[#dccba6]">Tk {item.product.price}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="rounded-md border border-[#d6b36a]/30 px-3 py-1 text-[#f0dca7]">-</button>
                    <span className="min-w-10 text-center text-[#f8ecd0]">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="rounded-md border border-[#d6b36a]/30 px-3 py-1 text-[#f0dca7]">+</button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between gap-3">
                  <p className="text-lg font-bold text-[#d6b36a]">Tk {item.product.price * item.quantity}</p>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    title="Remove item"
                    aria-label={`Remove ${item.product.title} from cart`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-400/25 bg-rose-500/5 text-rose-300 transition hover:border-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="h-fit rounded-2xl border border-[#d6b36a]/20 bg-[#130e0a] p-6 md:p-8">
            <h2 className="text-xl font-semibold text-[#f5e6c2]">Cart Summary</h2>
            <div className="mt-4 rounded-lg border border-[#d6b36a]/20 bg-[#1a120b] p-4 text-sm text-[#dccba6]">
              <div className="flex justify-between"><span>Subtotal</span><span>Tk {subtotal}</span></div>
              <div className="mt-2 flex justify-between border-t border-[#d6b36a]/20 pt-2 text-base font-semibold text-[#f5e6c2]"><span>Total</span><span>Tk {subtotal}</span></div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <Link href="/checkout" className="rounded-lg bg-[#c9a84c] px-5 py-3 text-center font-semibold text-[#1f1300] transition hover:bg-[#d8b760]">Proceed to Checkout</Link>
              <button type="button" onClick={clearCart} className="rounded-lg border border-[#d6b36a]/30 px-5 py-3 font-semibold text-[#f0dca7]">Clear Cart</button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
