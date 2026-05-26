"use client";

import { TableSkeleton } from "@/components/LoadingSkeletons";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { fetchOrders, updateOrderStatus } from "@/lib/orders";
import type { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { useEffect, useMemo, useState } from "react";

const fulfillmentStatuses: Array<{ value: OrderStatus; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "canceled", label: "Canceled" },
  { value: "refunded", label: "Refunded" },
  { value: "paid", label: "Paid (Legacy)" },
];

const paymentStatuses: Array<{ value: PaymentStatus; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

function formatLabel(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function statusBadgeClass(status: OrderStatus) {
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

function paymentBadgeClass(status: PaymentStatus) {
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

function paymentMethodLabel(value: string) {
  return value === "cash_on_delivery" ? "Cash on Delivery" : formatLabel(value);
}

function formatFulfillmentLabel(value: OrderStatus) {
  return value === "paid" ? "Paid (Legacy)" : formatLabel(value);
}

export default function AdminOrdersPage() {
  const { user, role } = useAuth();
  const { pushToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { status: OrderStatus; paymentStatus: PaymentStatus }>>({});

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const customerEmail = role === "admin" ? undefined : user?.email ?? undefined;
        const nextOrders = await fetchOrders(customerEmail);
        if (!active) {
          return;
        }

        setOrders(nextOrders);
        setDrafts(
          Object.fromEntries(nextOrders.map((order) => [order.id, { status: order.status, paymentStatus: order.paymentStatus }])),
        );
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

  const invoiceDownloadBase = "/api/admin/orders/invoice";

  function invoiceHref(orderId: string) {
    return `${invoiceDownloadBase}?orderId=${encodeURIComponent(orderId)}`;
  }

  function batchInvoiceHref(preset: "today" | "month" | "year") {
    return `${invoiceDownloadBase}?preset=${preset}`;
  }

  async function saveOrder(orderId: string) {
    const draft = drafts[orderId];
    if (!draft) {
      return;
    }

    try {
      setSavingId(orderId);
      const updatedOrder = await updateOrderStatus(orderId, draft);
      setOrders((current) => current.map((item) => (item.id === orderId ? updatedOrder : item)));
      pushToast({
        title: "Order Updated",
        message: `${updatedOrder.invoiceNumber} status saved successfully.`,
        variant: "success",
      });
    } catch (updateError) {
      pushToast({
        title: "Update Failed",
        message: updateError instanceof Error ? updateError.message : "Unable to update the order.",
        variant: "error",
      });
    } finally {
      setSavingId(null);
    }
  }

  return (
    <ProtectedRoute requireAdmin>
      <main className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
        <h1 className="text-3xl font-bold text-[#f5e6c2]">Manage Orders</h1>
        <p className="mt-2 text-sm text-[#dccba6]">Update order and payment status from one place.</p>

        <section className="mt-6 rounded-2xl border border-[#d6b36a]/20 bg-[#130e0a] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d6b36a]">Invoice Export</h2>
              <p className="mt-1 text-sm text-[#dccba6]">Download single order invoices or batch exports for packing slips.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={batchInvoiceHref("today")} className="rounded-md border border-[#d6b36a]/30 px-3 py-2 text-sm font-semibold text-[#f8ecd0] transition hover:bg-[#2a1d12]">
                Today
              </a>
              <a href={batchInvoiceHref("month")} className="rounded-md border border-[#d6b36a]/30 px-3 py-2 text-sm font-semibold text-[#f8ecd0] transition hover:bg-[#2a1d12]">
                Last 1 Month
              </a>
              <a href={batchInvoiceHref("year")} className="rounded-md border border-[#d6b36a]/30 px-3 py-2 text-sm font-semibold text-[#f8ecd0] transition hover:bg-[#2a1d12]">
                Last 1 Year
              </a>
            </div>
          </div>
        </section>

        {error ? <p className="mt-4 rounded-lg border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p> : null}

        {loading ? (
          <TableSkeleton rows={5} columns={5} />
        ) : visibleOrders.length === 0 ? (
          <p className="mt-6 rounded-lg border border-[#d6b36a]/25 bg-[#130e0a] p-6 text-[#dccba6]">No orders found yet.</p>
        ) : (
          <section className="mt-6 overflow-hidden rounded-xl border border-[#d6b36a]/20 bg-[#130e0a]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#1a120b] text-left text-sm text-[#f5e6c2]">
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Order Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((order) => {
                  const draft = drafts[order.id] || { status: order.status, paymentStatus: order.paymentStatus };
                  const dirty = draft.status !== order.status || draft.paymentStatus !== order.paymentStatus;

                  return (
                    <tr key={order.id} className="border-t border-[#d6b36a]/20 text-sm text-[#dccba6]">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[#f8ecd0]">{order.invoiceNumber}</div>
                        <div className="text-xs text-[#a89267]">{new Date(order.createdAt).toLocaleString()}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#f8ecd0]">{order.customer.name}</div>
                        <div className="text-xs">{order.customer.phone}</div>
                        <div className="text-xs">{order.customer.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="text-sm text-[#f8ecd0]">{paymentMethodLabel(order.paymentMethod)}</div>
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${paymentBadgeClass(order.paymentStatus)}`}>
                            {formatLabel(order.paymentStatus)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(order.status)}`}>
                          {formatLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="grid min-w-[260px] gap-3">
                          <label className="grid gap-1">
                            <span className="text-xs uppercase tracking-[0.18em] text-[#a89267]">Fulfillment</span>
                            <select
                              value={draft.status}
                              onChange={(event) =>
                                setDrafts((current) => ({
                                  ...current,
                                  [order.id]: { ...draft, status: event.target.value as OrderStatus },
                                }))
                              }
                              className="rounded-md border border-[#d6b36a]/30 bg-[#130e0a] px-3 py-2 text-sm text-[#f8ecd0]"
                            >
                              {fulfillmentStatuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="grid gap-1">
                            <span className="text-xs uppercase tracking-[0.18em] text-[#a89267]">Payment</span>
                            <select
                              value={draft.paymentStatus}
                              onChange={(event) =>
                                setDrafts((current) => ({
                                  ...current,
                                  [order.id]: { ...draft, paymentStatus: event.target.value as PaymentStatus },
                                }))
                              }
                              className="rounded-md border border-[#d6b36a]/30 bg-[#130e0a] px-3 py-2 text-sm text-[#f8ecd0]"
                            >
                              {paymentStatuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              ))}
                            </select>
                          </label>

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs text-[#a89267]">
                              {formatFulfillmentLabel(draft.status)} / {formatLabel(draft.paymentStatus)}
                            </span>
                            <div className="flex items-center gap-2">
                              <a
                                href={invoiceHref(order.id)}
                                className="rounded-md border border-[#d6b36a]/30 px-3 py-2 text-sm font-semibold text-[#f8ecd0] transition hover:bg-[#2a1d12]"
                              >
                                PDF
                              </a>
                              <button
                                type="button"
                                onClick={() => void saveOrder(order.id)}
                                disabled={savingId === order.id || !dirty}
                                className="rounded-md bg-[#c9a84c] px-4 py-2 text-sm font-semibold text-[#1f1300] transition disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {savingId === order.id ? "Saving..." : "Save"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </ProtectedRoute>
  );
}