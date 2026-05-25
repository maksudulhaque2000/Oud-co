import { NextResponse } from "next/server";
import { getOrder, updateOrderStatus } from "@/lib/mongo-orders";

function parseMaybeNumber(value: string | null) {
  if (!value) {
    return null;
  }

  const next = Number(value);
  return Number.isFinite(next) ? next : null;
}

async function readPayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await request.json().catch(() => null)) as Record<string, unknown> | null;
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return null;
  }

  return Object.fromEntries(formData.entries()) as Record<string, unknown>;
}

export async function POST(request: Request) {
  try {
    const payload = await readPayload(request);
    const orderId = typeof payload?.value_a === "string" ? payload.value_a : typeof payload?.orderId === "string" ? payload.orderId : null;
    const valId = typeof payload?.val_id === "string" ? payload.val_id : null;
    const paymentStatus = typeof payload?.status === "string" ? payload.status.toUpperCase() : null;
    const amount = parseMaybeNumber(typeof payload?.amount === "string" ? payload.amount : null);

    if (!orderId || !valId) {
      return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });
    }

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const amountMatches = amount !== null && Math.abs(amount - order.total) < 0.01;

    if ((paymentStatus === "VALID" || paymentStatus === "VALIDATED") && amountMatches) {
      await updateOrderStatus(order.id, "paid", "paid");
      return NextResponse.json({ ok: true });
    }

    await updateOrderStatus(order.id, "pending", "failed");
    return NextResponse.json({ ok: false }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to process payment notification." },
      { status: 500 },
    );
  }
}