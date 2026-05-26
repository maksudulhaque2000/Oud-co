import { Suspense } from "react";
import PaymentSuccessClient from "./PaymentSuccessClient";

export default async function PaymentSuccessPage({
  searchParams,
}: Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const orderId = typeof resolvedSearchParams.orderId === "string" ? resolvedSearchParams.orderId : "";
  const valId = typeof resolvedSearchParams.val_id === "string" ? resolvedSearchParams.val_id : "";

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-12 md:px-6">
      <Suspense
        fallback={
          <section className="w-full rounded-3xl border border-[#d6b36a]/20 bg-[#130e0a] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
            <p className="text-sm uppercase tracking-[0.28em] text-[#c9a84c]">Payment Success</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#f5e6c2]">Thank you for your order</h1>
            <p className="mt-3 text-sm text-[#dccba6]">Verifying your payment...</p>
          </section>
        }
      >
        <PaymentSuccessClient orderId={orderId} valId={valId} />
      </Suspense>
    </main>
  );
}