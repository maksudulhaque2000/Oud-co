import { NextResponse } from "next/server";
import { getOrder, updateOrderStatus } from "@/lib/mongo-orders";

function getValidationApiUrl() {
  return process.env.SSL_COMMERZ_IS_TEST === "false"
    ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
    : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get("orderId");
    const valId = url.searchParams.get("val_id");

    if (!orderId || !valId) {
      return NextResponse.json({ error: "orderId and val_id are required." }, { status: 400 });
    }

    const order = await getOrder(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const storeId = process.env.SSL_COMMERZ_STORE_ID;
    const storePassword = process.env.SSL_COMMERZ_STORE_PASSWORD;

    if (!storeId || !storePassword) {
      return NextResponse.json({ error: "SSLCommerz credentials are not configured." }, { status: 500 });
    }

    const query = new URLSearchParams({
      val_id: valId,
      store_id: storeId,
      store_passwd: storePassword,
      format: "json",
    });

    const response = await fetch(`${getValidationApiUrl()}?${query.toString()}`);
    const payload = (await response.json().catch(() => null)) as { status?: string; amount?: string; val_id?: string; tran_id?: string; failedreason?: string } | null;

    if (!response.ok || !payload?.status) {
      return NextResponse.json({ error: payload?.failedreason || "Unable to validate payment." }, { status: 502 });
    }

    const validatedAmount = Number(payload.amount ?? 0);
    const amountMatches = Number.isFinite(validatedAmount) && Math.abs(validatedAmount - order.total) < 0.01;
    const paymentCompleted = payload.status === "VALID" || payload.status === "VALIDATED";

    if (paymentCompleted && amountMatches) {
      await updateOrderStatus(order.id, "paid", "paid");
      return NextResponse.json({ status: "paid", orderId: order.id, tranId: payload.tran_id, valId: payload.val_id });
    }

    await updateOrderStatus(order.id, "pending", "failed");
    return NextResponse.json(
      { error: "Payment validation failed.", status: payload.status, orderId: order.id, tranId: payload.tran_id },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to validate payment." },
      { status: 500 },
    );
  }
}