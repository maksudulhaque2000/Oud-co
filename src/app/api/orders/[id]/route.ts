import { NextResponse } from "next/server";
import { getOrder, updateOrderStatus } from "@/lib/mongo-orders";
import type { OrderStatus, PaymentStatus } from "@/types/order";

const orderStatuses: OrderStatus[] = ["pending", "paid", "processing", "shipped", "delivered", "canceled", "refunded"];
const paymentStatuses: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];

function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && orderStatuses.includes(value as OrderStatus);
}

function isPaymentStatus(value: unknown): value is PaymentStatus {
  return typeof value === "string" && paymentStatuses.includes(value as PaymentStatus);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await request.json().catch(() => null)) as { status?: unknown; paymentStatus?: unknown } | null;

    if (!body || (!isOrderStatus(body.status) && !isPaymentStatus(body.paymentStatus))) {
      return NextResponse.json({ error: "Invalid order status payload." }, { status: 400 });
    }

    const order = await getOrder(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const nextStatus = isOrderStatus(body.status) ? body.status : order.status;
    const nextPaymentStatus = isPaymentStatus(body.paymentStatus) ? body.paymentStatus : order.paymentStatus;
    const updatedOrder = await updateOrderStatus(order.id, nextStatus, nextPaymentStatus);

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update order." },
      { status: 500 },
    );
  }
}