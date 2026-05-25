import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-12 md:px-6">
      <section className="w-full rounded-3xl border border-[#d6b36a]/20 bg-[#130e0a] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
        <p className="text-sm uppercase tracking-[0.28em] text-[#c9a84c]">Payment Cancelled</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#f5e6c2]">Payment was cancelled</h1>
        <p className="mt-3 text-sm text-[#dccba6]">No payment was captured. You can go back to checkout and choose another method.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/checkout" className="rounded-full bg-[#c9a84c] px-5 py-3 font-semibold text-[#1f1300] transition hover:bg-[#d8b760]">
            Return to Checkout
          </Link>
          <Link href="/products" className="rounded-full border border-[#d6b36a]/20 px-5 py-3 font-semibold text-[#f5e6c2] transition hover:border-[#d6b36a]/40">
            Browse Products
          </Link>
        </div>
      </section>
    </main>
  );
}