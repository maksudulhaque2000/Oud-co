"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { fetchOrders } from "@/lib/orders";
import type { Order } from "@/types/order";

function getStatusBadgeClass(status: Order["status"]) {
  switch (status) {
    case "paid":
      return "border border-emerald-400/25 bg-emerald-500/10 text-emerald-200";
    case "processing":
      return "border border-sky-400/25 bg-sky-500/10 text-sky-200";
    case "shipped":
      return "border border-cyan-400/25 bg-cyan-500/10 text-cyan-200";
    case "delivered":
      return "border border-lime-400/25 bg-lime-500/10 text-lime-200";
    case "canceled":
      return "border border-rose-400/25 bg-rose-500/10 text-rose-200";
    case "refunded":
      return "border border-violet-400/25 bg-violet-500/10 text-violet-200";
    default:
      return "border border-amber-400/25 bg-amber-500/10 text-amber-200";
  }
}

function getPaymentStatusBadgeClass(status: Order["paymentStatus"]) {
  switch (status) {
    case "paid":
      return "border border-emerald-400/25 bg-emerald-500/10 text-emerald-200";
    case "failed":
      return "border border-rose-400/25 bg-rose-500/10 text-rose-200";
    case "refunded":
      return "border border-violet-400/25 bg-violet-500/10 text-violet-200";
    default:
      return "border border-amber-400/25 bg-amber-500/10 text-amber-200";
  }
}

function formatStatusLabel(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatPaymentMethod(value: string) {
  return value === "cash_on_delivery" ? "Cash on Delivery" : formatStatusLabel(value);
}

export default function OrdersPage() {
  const { user, role } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const nextOrders = await fetchOrders(role === "admin" ? undefined : user.email);
        if (!active) {
          return;
        }
        setOrders(nextOrders);
        setError(null);
      } catch (loadError) {
        if (!active) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "Unable to load orders.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      active = false;
    };
  }, [role, user?.email]);

  const visibleOrders = useMemo(() => orders, [orders]);

  return (
    <ProtectedRoute>
      <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <h1 className="text-3xl font-bold text-[#f5e6c2]">Order History</h1>
        <p className="mt-2 text-sm text-[#dccba6]">Customers can view their own orders. Admins can review every order.</p>

        {error ? <p className="mt-4 rounded-lg border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p> : null}
        {loading ? <p className="mt-6 rounded-lg border border-[#d6b36a]/25 bg-[#130e0a] p-6 text-[#dccba6]">Loading orders...</p> : null}

        {!loading && visibleOrders.length === 0 ? (
          <p className="mt-6 rounded-lg border border-[#d6b36a]/25 bg-[#130e0a] p-6 text-[#dccba6]">No orders found yet.</p>
        ) : null}

        {visibleOrders.length > 0 ? (
          <section className="mt-6 overflow-hidden rounded-xl border border-[#d6b36a]/20 bg-[#130e0a]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#1a120b] text-left text-sm text-[#f5e6c2]">
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Order Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((order) => (
                  <tr key={order.id} className="border-t border-[#d6b36a]/20 text-sm text-[#dccba6]">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#f8ecd0]">{order.invoiceNumber}</div>
                      <div className="text-xs text-[#a89267]">{new Date(order.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#f8ecd0]">{order.customer.name}</div>
                      <div className="text-xs">{order.customer.phone}</div>
                      <div className="text-xs">{order.customer.email}</div>
                      <div className="text-xs text-[#a89267]">{order.customer.address || "Address not provided"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.productId} className="text-xs">
                            {item.title} x {item.quantity} - Tk {item.unitPrice}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#d6b36a]">Tk {order.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="text-sm text-[#f8ecd0]">{formatPaymentMethod(order.paymentMethod)}</div>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                          {formatStatusLabel(order.paymentStatus)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClass(order.status)}`}>
                        {formatStatusLabel(order.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : null}
      </main>
    </ProtectedRoute>
  );
}
