import { NextResponse } from "next/server";
import { getOrder, updateOrderStatus } from "@/lib/mongo-orders";

function getValidationApiUrl() {
  return process.env.SSL_COMMERZ_IS_TEST === "false"
    ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
    : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";
}

function getTransactionQueryApiUrl() {
  return process.env.SSL_COMMERZ_IS_TEST === "false"
    ? "https://securepay.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php"
    : "https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php";
}

type ValidationPayload = {
  status?: string;
  amount?: string;
  val_id?: string;
  tran_id?: string;
  failedreason?: string;
};

async function validateByValId(valId: string, storeId: string, storePassword: string) {
  const query = new URLSearchParams({
    val_id: valId,
    store_id: storeId,
    store_passwd: storePassword,
    format: "json",
  });

  const response = await fetch(`${getValidationApiUrl()}?${query.toString()}`);
  const payload = (await response.json().catch(() => null)) as ValidationPayload | null;
  return { response, payload };
}

async function validateBySessionKey(sessionKey: string, storeId: string, storePassword: string) {
  const query = new URLSearchParams({
    sessionkey: sessionKey,
    store_id: storeId,
    store_passwd: storePassword,
    format: "json",
  });

  const response = await fetch(`${getTransactionQueryApiUrl()}?${query.toString()}`);
  const payload = (await response.json().catch(() => null)) as ValidationPayload | { element?: ValidationPayload[] } | null;
  return { response, payload };
}

async function validateByTranId(tranId: string, storeId: string, storePassword: string) {
  const query = new URLSearchParams({
    tran_id: tranId,
    store_id: storeId,
    store_passwd: storePassword,
    format: "json",
  });

  const response = await fetch(`${getTransactionQueryApiUrl()}?${query.toString()}`);
  const payload = (await response.json().catch(() => null)) as { element?: ValidationPayload[] } | ValidationPayload | null;
  return { response, payload };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get("orderId");
    const valId = url.searchParams.get("val_id");

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required." }, { status: 400 });
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

    const normalizedValId = typeof valId === "string" && valId.trim() ? valId.trim() : null;
    const normalizedSessionKey = typeof order.gatewaySessionKey === "string" && order.gatewaySessionKey.trim() ? order.gatewaySessionKey.trim() : null;

    let validationStatus: string | undefined;
    let validatedAmount = 0;
    let validatedTranId: string | undefined;
    let validatedValId: string | undefined;

    if (normalizedValId) {
      const { response, payload } = await validateByValId(normalizedValId, storeId, storePassword);

      if (!response.ok || !payload?.status) {
        return NextResponse.json({ error: payload?.failedreason || "Unable to validate payment." }, { status: 502 });
      }

      validationStatus = payload.status;
      validatedAmount = Number(payload.amount ?? 0);
      validatedTranId = payload.tran_id;
      validatedValId = payload.val_id;
    } else if (normalizedSessionKey) {
      const { response, payload } = await validateBySessionKey(normalizedSessionKey, storeId, storePassword);

      if (!response.ok || !payload) {
        return NextResponse.json({ error: "Unable to validate payment." }, { status: 502 });
      }

      const element = Array.isArray((payload as { element?: ValidationPayload[] }).element)
        ? (payload as { element?: ValidationPayload[] }).element?.[0]
        : (payload as ValidationPayload);

      if (!element?.status) {
        return NextResponse.json({ error: "Unable to validate payment." }, { status: 502 });
      }

      validationStatus = element.status;
      validatedAmount = Number(element.amount ?? 0);
      validatedTranId = element.tran_id;
      validatedValId = element.val_id;
    } else {
      const { response, payload } = await validateByTranId(order.invoiceNumber, storeId, storePassword);

      if (!response.ok || !payload) {
        return NextResponse.json({ error: "Unable to validate payment." }, { status: 502 });
      }

      const element = Array.isArray((payload as { element?: ValidationPayload[] }).element)
        ? (payload as { element?: ValidationPayload[] }).element?.[0]
        : (payload as ValidationPayload);

      if (!element?.status) {
        return NextResponse.json({ error: "Unable to validate payment." }, { status: 502 });
      }

      validationStatus = element.status;
      validatedAmount = Number(element.amount ?? 0);
      validatedTranId = element.tran_id;
      validatedValId = element.val_id;
    }

    const amountMatches = Number.isFinite(validatedAmount) && Math.abs(validatedAmount - order.total) < 0.01;
    const paymentCompleted = validationStatus === "VALID" || validationStatus === "VALIDATED";

    if (paymentCompleted && amountMatches) {
      await updateOrderStatus(order.id, "processing", "paid");
      return NextResponse.json({ status: "paid", orderId: order.id, tranId: validatedTranId, valId: validatedValId, orderStatus: "processing" });
    }

    if (validationStatus === "PENDING") {
      return NextResponse.json({ status: "pending", orderId: order.id, tranId: validatedTranId, valId: validatedValId }, { status: 200 });
    }

    await updateOrderStatus(order.id, "pending", "failed");
    return NextResponse.json(
      { error: "Payment validation failed.", status: validationStatus, orderId: order.id, tranId: validatedTranId },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to validate payment." },
      { status: 500 },
    );
  }
}