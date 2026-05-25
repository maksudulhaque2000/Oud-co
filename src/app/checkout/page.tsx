"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { createOrder, initiateSslcommerzPayment } from "@/lib/orders";
import { normalizeImageSource } from "@/lib/products";
import type { PaymentMethod } from "@/types/order";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { useToast } from "@/context/ToastContext";

const paymentMethods: Array<{ value: PaymentMethod; label: string; description: string; enabled: boolean }> = [
  { value: "sslcommerz", label: "SSLCommerz", description: "Online cards, mobile banking, and bank payment gateway.", enabled: true },
  { value: "bkash", label: "bKash", description: "Coming soon.", enabled: false },
  { value: "nagad", label: "Nagad", description: "Coming soon.", enabled: false },
  { value: "stripe", label: "Stripe", description: "Coming soon.", enabled: false },
  { value: "prepayment", label: "Prepayment", description: "Manual bank transfer or support-assisted payment.", enabled: true },
  { value: "cash_on_delivery", label: "Cash on Delivery", description: "Pay when the order is delivered.", enabled: true },
];

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { pushToast } = useToast();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("sslcommerz");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const customerName = user?.displayName?.trim() || user?.email?.trim() || "Customer";
  const customerEmail = user?.email?.trim() || "";

  const orderItems = useMemo(
    () =>
      items.map((item) => {
        const lineSubtotal = item.product.price * item.quantity;
        const vatAmount = lineSubtotal * (item.product.vatPercent / 100);
        const discountAmount = lineSubtotal * (item.product.discountPercent / 100);
        const lineTotal = Math.max(0, lineSubtotal + vatAmount + item.product.shippingCharge - discountAmount);

        return {
          productId: item.product.id,
          title: item.product.title,
          imageUrl: normalizeImageSource(item.product.imageUrl),
          unitPrice: item.product.price,
          quantity: item.quantity,
          vatPercent: item.product.vatPercent,
          discountPercent: item.product.discountPercent,
          shippingCharge: item.product.shippingCharge,
          lineSubtotal,
          lineVatAmount: vatAmount,
          lineDiscountAmount: discountAmount,
          lineShippingCharge: item.product.shippingCharge,
          lineTotal,
          publishedByAdminEmail: item.product.publishedByAdminEmail,
          publishedByAdminUid: item.product.publishedByAdminUid,
          publishedByAdminName: item.product.publishedByAdminName,
        };
      }),
    [items],
  );

  const totals = useMemo(() => {
    const vatAmount = orderItems.reduce((sum, item) => sum + item.lineVatAmount, 0);
    const discountAmount = orderItems.reduce((sum, item) => sum + item.lineDiscountAmount, 0);
    const shipping = orderItems.reduce((sum, item) => sum + item.lineShippingCharge, 0);
    const total = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);

    return { vatAmount, discountAmount, shipping, total };
  }, [orderItems]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      pushToast({ title: "Cart is empty", message: "Add at least one product before checkout.", variant: "error" });
      return;
    }

    if (!phone.trim()) {
      pushToast({ title: "Mobile number required", message: "Please enter your mobile number to proceed.", variant: "error" });
      return;
    }

    try {
      setLoading(true);
      const order = await createOrder({
        customer: { name: customerName, phone: phone.trim(), email: customerEmail },
        items: orderItems,
        paymentMethod,
        shippingMethod: "home_delivery",
        notes: notes.trim() || undefined,
      });

      if (paymentMethod === "sslcommerz") {
        const payment = await initiateSslcommerzPayment(order.id);
        pushToast({
          title: "Redirecting to payment",
          message: "You are being sent to SSLCommerz to complete the payment.",
          variant: "success",
        });
        window.location.assign(payment.gatewayUrl);
        return;
      }

      clearCart();
      pushToast({
        title: "Order Created",
        message: `Invoice ${order.invoiceNumber} has been saved successfully.`,
        variant: "success",
      });
      router.push("/orders");
    } catch (error) {
      pushToast({
        title: "Unable to place order",
        message: error instanceof Error ? error.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <h1 className="text-3xl font-bold text-[#f5e6c2]">Checkout</h1>
        <p className="mt-2 text-sm text-[#dccba6]">Review your cart and complete the order with SSLCommerz or an offline payment method.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#d6b36a]/20 bg-[#130e0a] p-6 md:p-8">
            <h2 className="text-xl font-semibold text-[#f5e6c2]">Customer Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-[#f0dca7]">Name</label>
                <input value={customerName} readOnly className="w-full rounded-lg border border-[#d6b36a]/20 bg-[#1a120b] px-4 py-3 text-[#cdb890] outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#f0dca7]">Email</label>
                <input value={customerEmail} readOnly className="w-full rounded-lg border border-[#d6b36a]/20 bg-[#1a120b] px-4 py-3 text-[#cdb890] outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm text-[#f0dca7]">Mobile Number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  inputMode="tel"
                  required
                  className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] focus:ring-2"
                />
                <p className="mt-1 text-xs text-[#bca475]">Mobile number is required to place the order.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-[#f0dca7]">Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] focus:ring-2">
                  {paymentMethods.filter((method) => method.enabled).map((method) => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-[#bca475]">Only SSLCommerz is fully online right now. Other gateways can be added next.</p>
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#f0dca7]">Shipping Method</label>
                <input value="Home Delivery" readOnly className="w-full rounded-lg border border-[#d6b36a]/20 bg-[#1a120b] px-4 py-3 text-[#cdb890] outline-none" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-[#f0dca7]">Order Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] focus:ring-2" />
            </div>

            <button type="submit" disabled={loading} className="rounded-lg bg-[#c9a84c] px-5 py-3 font-semibold text-[#1f1300] transition hover:bg-[#d8b760] disabled:opacity-60">
              {loading ? "Processing..." : paymentMethod === "sslcommerz" ? "Pay with SSLCommerz" : "Place Order"}
            </button>
          </form>

          <aside className="rounded-2xl border border-[#d6b36a]/20 bg-[#130e0a] p-6 md:p-8">
            <h2 className="text-xl font-semibold text-[#f5e6c2]">Order Summary</h2>
            <div className="mt-4 space-y-4">
              {items.length === 0 ? (
                <p className="rounded-lg border border-[#d6b36a]/20 bg-[#1a120b] p-4 text-sm text-[#dccba6]">Your cart is empty.</p>
              ) : (
                orderItems.map((item) => (
                  <div key={item.productId} className="flex gap-3 rounded-lg border border-[#d6b36a]/20 bg-[#1a120b] p-3">
                    <img src={item.imageUrl} alt={item.title} className="h-16 w-16 rounded-md object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[#f8ecd0]">{item.title}</p>
                      <p className="text-sm text-[#cdb890]">Qty {item.quantity}</p>
                      <p className="text-xs text-[#a89267]">VAT {item.vatPercent}% | Discount {item.discountPercent}% | Shipping Tk {item.shippingCharge}</p>
                      <p className="text-sm font-semibold text-[#d6b36a]">Tk {item.lineTotal.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <dl className="mt-6 space-y-2 rounded-lg border border-[#d6b36a]/20 bg-[#1a120b] p-4 text-sm text-[#dccba6]">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>Tk {subtotal}</dd></div>
              <div className="flex justify-between"><dt>VAT</dt><dd>Tk {totals.vatAmount.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt>Discount</dt><dd>- Tk {totals.discountAmount.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt>Shipping</dt><dd>Tk {totals.shipping.toFixed(2)}</dd></div>
              <div className="flex justify-between border-t border-[#d6b36a]/20 pt-2 text-base font-semibold text-[#f5e6c2]"><dt>Total</dt><dd>Tk {totals.total.toFixed(2)}</dd></div>
            </dl>
          </aside>
        </div>
      </main>
    </ProtectedRoute>
  );
}
