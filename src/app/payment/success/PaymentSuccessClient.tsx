"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

type ResultState =
  | { kind: "loading"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

type PaymentSuccessClientProps = {
  orderId: string;
  valId: string;
};

export default function PaymentSuccessClient({ orderId, valId }: PaymentSuccessClientProps) {
  const { clearCart } = useCart();
  const [state, setState] = useState<ResultState>({ kind: "loading", message: "Verifying your payment..." });

  useEffect(() => {
    let active = true;

    async function validatePayment() {
      if (!orderId || !valId) {
        if (active) {
          setState({ kind: "error", message: "Payment reference is missing. Please contact support if money was deducted." });
        }
        return;
      }

      try {
        const response = await fetch(`/api/payments/sslcommerz/validate?orderId=${encodeURIComponent(orderId)}&val_id=${encodeURIComponent(valId)}`);
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;

        if (!active) {
          return;
        }

        if (!response.ok) {
          setState({ kind: "error", message: payload?.error || "Payment validation failed." });
          return;
        }

        clearCart();
        setState({ kind: "success", message: "Payment confirmed. Your order has been marked as paid." });
      } catch (error) {
        if (active) {
          setState({ kind: "error", message: error instanceof Error ? error.message : "Unable to verify payment." });
        }
      }
    }

    validatePayment();

    return () => {
      active = false;
    };
  }, [orderId, valId, clearCart]);

  return (
    <section className="w-full rounded-3xl border border-[#d6b36a]/20 bg-[#130e0a] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
      <p className="text-sm uppercase tracking-[0.28em] text-[#c9a84c]">Payment Success</p>
      <h1 className="mt-3 text-3xl font-semibold text-[#f5e6c2]">Thank you for your order</h1>
      <p className="mt-3 text-sm text-[#dccba6]">{state.message}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/orders" className="rounded-full bg-[#c9a84c] px-5 py-3 font-semibold text-[#1f1300] transition hover:bg-[#d8b760]">
          View Orders
        </Link>
        <Link href="/products" className="rounded-full border border-[#d6b36a]/20 px-5 py-3 font-semibold text-[#f5e6c2] transition hover:border-[#d6b36a]/40">
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}