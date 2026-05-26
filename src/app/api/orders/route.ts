import { NextResponse } from "next/server";
import { createOrder, listOrders, listOrdersByCustomerEmail } from "@/lib/mongo-orders";
import type { CreateOrderInput } from "@/types/order";

function isString(value: unknown) {
  return typeof value === "string";
}

function isNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value);
}

function isItem(value: unknown) {
  return typeof value === "object" && value !== null && isString((value as { productId?: unknown }).productId) && isString((value as { title?: unknown }).title) && isString((value as { imageUrl?: unknown }).imageUrl) && isNumber((value as { unitPrice?: unknown }).unitPrice) && isNumber((value as { quantity?: unknown }).quantity);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const customerEmail = url.searchParams.get("customerEmail") || undefined;
    const orders = customerEmail ? await listOrdersByCustomerEmail(customerEmail) : await listOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load orders." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as Partial<CreateOrderInput> | null;

    if (
      !body ||
      !body.customer ||
      !isString(body.customer.name) ||
      !isString(body.customer.phone) ||
      !isString(body.customer.email) ||
      !isString(body.customer.address) ||
      !Array.isArray(body.items) ||
      body.items.length === 0 ||
      body.items.some((item) => !isItem(item)) ||
      !isString(body.paymentMethod)
    ) {
      return NextResponse.json({ error: "Invalid order payload." }, { status: 400 });
    }

    const order = await createOrder({
      customer: body.customer,
      items: body.items,
      paymentMethod: body.paymentMethod as CreateOrderInput["paymentMethod"],
      shippingMethod: isString(body.shippingMethod)
        ? (body.shippingMethod as CreateOrderInput["shippingMethod"])
        : undefined,
      notes: isString(body.notes) ? body.notes : undefined,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create order." },
      { status: 500 },
    );
  }
}
