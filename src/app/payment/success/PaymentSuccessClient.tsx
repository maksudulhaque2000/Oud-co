"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { PaymentValidationSkeleton } from "@/components/LoadingSkeletons";

type ResultState =
  | { kind: "loading"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

type PaymentSuccessClientProps = {
  orderId: string;
  valId: string;
  status: string;
  amount: string;
  tranId: string;
};

function isSuccessfulGatewayStatus(status: string) {
  const normalized = status.trim().toUpperCase();
  return normalized === "VALID" || normalized === "VALIDATED";
}

export default function PaymentSuccessClient({ orderId, valId, status, amount, tranId }: PaymentSuccessClientProps) {
  const { clearCart } = useCart();
  const [state, setState] = useState<ResultState>({ kind: "loading", message: "Verifying your payment..." });

  async function confirmWithGatewayReturn() {
    const response = await fetch("/api/payments/sslcommerz/ipn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        tran_id: tranId || orderId,
        status,
        amount,
      }),
    });

    const payload = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      throw new Error(payload?.error || "Payment validation failed.");
    }
  }

  useEffect(() => {
    let active = true;

    async function validatePayment() {
      try {
        if (!orderId) {
          if (active) {
            setState({ kind: "error", message: "Payment reference is missing. Please contact support if money was deducted." });
          }
          return;
        }

        const query = new URLSearchParams({ orderId });
        if (valId) {
          query.set("val_id", valId);
        }

        const response = await fetch(`/api/payments/sslcommerz/validate?${query.toString()}`);
        const payload = (await response.json().catch(() => null)) as { error?: string; status?: string } | null;

        if (!active) {
          return;
        }

        if (response.ok && payload?.status === "pending") {
          setState({ kind: "loading", message: "Payment is still being confirmed. Please refresh after a moment." });
          return;
        }

        if (response.ok) {
          clearCart();
          setState({ kind: "success", message: "Payment confirmed. Your order has been marked as paid." });
          return;
        }

        if (isSuccessfulGatewayStatus(status) && amount) {
          try {
            await confirmWithGatewayReturn();
            if (!active) {
              return;
            }

            clearCart();
            setState({ kind: "success", message: "Payment confirmed. Your order has been marked as paid." });
            return;
          } catch (fallbackError) {
            if (!active) {
              return;
            }

            setState({ kind: "error", message: (fallbackError instanceof Error ? fallbackError.message : null) || payload?.error || "Payment validation failed." });
            return;
          }
        }

        if (active) {
          setState({ kind: "error", message: payload?.error || "Payment validation failed." });
        }
      } catch (error) {
        if (!active) {
          return;
        }

        setState({ kind: "error", message: error instanceof Error ? error.message : "Unable to verify payment." });
      }
    }

    validatePayment();

    return () => {
      active = false;
    };
  }, [amount, clearCart, orderId, status, tranId, valId]);

  return (
    <>
      {state.kind === "loading" ? (
        <PaymentValidationSkeleton />
      ) : (
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
      )}
    </>
  );
}