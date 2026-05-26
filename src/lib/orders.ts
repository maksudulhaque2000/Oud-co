import type { CreateOrderInput, Order } from "@/types/order";

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as { error?: string } | null;

  if (!response.ok) {
    throw new Error(payload?.error || "Request failed.");
  }

  return payload as T;
}

export async function fetchOrders(customerEmail?: string) {
  const query = customerEmail ? `?customerEmail=${encodeURIComponent(customerEmail)}` : "";
  const payload = await requestJson<{ orders: Order[] }>(`/api/orders${query}`);
  return payload.orders;
}

export async function createOrder(input: CreateOrderInput) {
  const payload = await requestJson<{ order: Order }>("/api/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return payload.order;
}

export async function updateOrderStatus(orderId: string, input: { status?: Order["status"]; paymentStatus?: Order["paymentStatus"] }) {
  const payload = await requestJson<{ order: Order }>(`/api/orders/${encodeURIComponent(orderId)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  return payload.order;
}

export async function initiateSslcommerzPayment(orderId: string) {
  const payload = await requestJson<{ gatewayUrl: string; sessionKey: string }>("/api/payments/sslcommerz", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });

  return payload;
}
