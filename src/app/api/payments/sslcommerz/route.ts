import { NextResponse } from "next/server";
import { getOrder } from "@/lib/mongo-orders";

type SslGatewayResponse = {
  GatewayPageURL?: string;
  redirectGatewayURL?: string;
  directPaymentURL?: string;
  sessionkey?: string;
  failedreason?: string;
  status?: string;
};

function getBaseUrl(request: Request) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    request.headers.get("origin")?.replace(/\/$/, "") ||
    new URL(request.url).origin
  );
}

function isString(value: unknown) {
  return typeof value === "string";
}

function getGatewayApiUrl() {
  return process.env.SSL_COMMERZ_IS_TEST === "false"
    ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
    : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
}

function parseGatewayResponse(raw: string): SslGatewayResponse | null {
  const trimmed = raw.trim();

  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed) as SslGatewayResponse;
  } catch {
    const query = new URLSearchParams(trimmed);

    if (query.size === 0) {
      return null;
    }

    return {
      GatewayPageURL: query.get("GatewayPageURL") || undefined,
      redirectGatewayURL: query.get("redirectGatewayURL") || undefined,
      directPaymentURL: query.get("directPaymentURL") || undefined,
      sessionkey: query.get("sessionkey") || undefined,
      failedreason: query.get("failedreason") || undefined,
      status: query.get("status") || undefined,
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { orderId?: unknown } | null;

    if (!body || !isString(body.orderId)) {
      return NextResponse.json({ error: "Order id is required." }, { status: 400 });
    }

    const order = await getOrder(body.orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const storeId = process.env.SSL_COMMERZ_STORE_ID;
    const storePassword = process.env.SSL_COMMERZ_STORE_PASSWORD;

    if (!storeId || !storePassword) {
      return NextResponse.json({ error: "SSLCommerz credentials are not configured." }, { status: 500 });
    }

    const baseUrl = getBaseUrl(request);
    const gatewayApiUrl = getGatewayApiUrl();
    const defaultCity = "Dhaka";
    const defaultState = "Dhaka";
    const defaultPostcode = "1207";
    const defaultCountry = "Bangladesh";
    const defaultAddress = order.customer.address?.trim() || "Dhaka";
    const totalAmount = order.total.toFixed(2);
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

    const params = new URLSearchParams();
    params.set("store_id", storeId);
    params.set("store_passwd", storePassword);
    params.set("total_amount", totalAmount);
    params.set("currency", process.env.NEXT_PUBLIC_CURRENCY || "BDT");
    params.set("tran_id", order.invoiceNumber);
    params.set("success_url", `${baseUrl}/payment/success?orderId=${encodeURIComponent(order.id)}`);
    params.set("fail_url", `${baseUrl}/payment/fail?orderId=${encodeURIComponent(order.id)}`);
    params.set("cancel_url", `${baseUrl}/payment/cancel?orderId=${encodeURIComponent(order.id)}`);
    params.set("ipn_url", `${baseUrl}/api/payments/sslcommerz/ipn`);
    params.set("cus_name", order.customer.name);
    params.set("cus_email", order.customer.email);
    params.set("cus_add1", defaultAddress);
    params.set("cus_add2", defaultAddress);
    params.set("cus_city", defaultCity);
    params.set("cus_state", defaultState);
    params.set("cus_postcode", defaultPostcode);
    params.set("cus_country", defaultCountry);
    params.set("cus_phone", order.customer.phone);
    params.set("ship_name", order.customer.name);
    params.set("ship_add1", defaultAddress);
    params.set("ship_add2", defaultAddress);
    params.set("ship_city", defaultCity);
    params.set("ship_state", defaultState);
    params.set("ship_postcode", defaultPostcode);
    params.set("ship_country", defaultCountry);
    params.set("shipping_method", "YES");
    params.set("num_of_item", String(itemCount));
    params.set("product_name", order.items.map((item) => item.title).join(", ").slice(0, 255));
    params.set("product_category", "ecommerce");
    params.set("product_profile", "general");
    params.set("product_amount", order.subtotal.toFixed(2));
    params.set("vat", order.vatAmount.toFixed(2));
    params.set("discount_amount", order.discountAmount.toFixed(2));
    params.set("value_a", order.id);
    params.set("value_b", order.invoiceNumber);
    params.set("value_c", order.customer.email);
    params.set("value_d", order.customer.phone);

    const response = await fetch(gatewayApiUrl, {
      method: "POST",
      body: params,
    });

    const rawPayload = await response.text();
    const payload = parseGatewayResponse(rawPayload);
    const gatewayUrl = payload?.GatewayPageURL || payload?.redirectGatewayURL || payload?.directPaymentURL;

    if (!response.ok || !gatewayUrl) {
      return NextResponse.json(
        {
          error:
            payload?.failedreason ||
            payload?.status ||
            "Unable to initiate payment. Please verify SSLCommerz credentials and merchant account status.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ gatewayUrl, sessionKey: payload?.sessionkey || "" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to initiate payment." },
      { status: 500 },
    );
  }
}