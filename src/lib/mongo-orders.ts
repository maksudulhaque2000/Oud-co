import { randomUUID } from "node:crypto";
import { Collection } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import type { CreateOrderInput, Order, OrderItem, OrderStatus, PaymentStatus } from "@/types/order";

const COLLECTION_NAME = "orders";

type OrderDocument = Order & { _id: string };

function clampPercent(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, value));
}

function clampAmount(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}

function normalizeItem(item: OrderItem): OrderItem {
  const quantity = Math.max(1, Math.floor(item.quantity));
  const unitPrice = clampAmount(item.unitPrice);
  const vatPercent = clampPercent(item.vatPercent);
  const discountPercent = clampPercent(item.discountPercent);
  const shippingCharge = clampAmount(item.shippingCharge);
  const lineSubtotal = unitPrice * quantity;
  const lineVatAmount = lineSubtotal * (vatPercent / 100);
  const lineDiscountAmount = lineSubtotal * (discountPercent / 100);
  const lineTotal = Math.max(0, lineSubtotal + lineVatAmount + shippingCharge - lineDiscountAmount);

  return {
    ...item,
    quantity,
    unitPrice,
    vatPercent,
    discountPercent,
    shippingCharge,
    lineSubtotal,
    lineVatAmount,
    lineDiscountAmount,
    lineShippingCharge: shippingCharge,
    lineTotal,
  };
}

function computeTotals(items: OrderItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.lineSubtotal, 0);
  const vatAmount = items.reduce((sum, item) => sum + item.lineVatAmount, 0);
  const discountAmount = items.reduce((sum, item) => sum + item.lineDiscountAmount, 0);
  const shippingCharge = items.reduce((sum, item) => sum + item.lineShippingCharge, 0);
  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    subtotal,
    vatAmount,
    discountAmount,
    shippingCharge,
    total,
  };
}

function createInvoiceNumber() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `OUD-${stamp}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function toOrder(document: OrderDocument): Order {
  const { _id, ...rest } = document;
  return {
    ...rest,
    id: rest.id || _id,
  };
}

async function getOrdersCollection(): Promise<Collection<OrderDocument>> {
  const db = await getMongoDb();
  return db.collection<OrderDocument>(COLLECTION_NAME);
}

export async function listOrders() {
  const collection = await getOrdersCollection();
  const orders = await collection.find().sort({ createdAt: -1 }).toArray();
  return orders.map(toOrder);
}

export async function listOrdersByDateRange(startIso: string, endIso: string) {
  const collection = await getOrdersCollection();
  const orders = await collection
    .find({
      createdAt: {
        $gte: startIso,
        $lte: endIso,
      },
    })
    .sort({ createdAt: -1 })
    .toArray();

  return orders.map(toOrder);
}

export async function listOrdersByCustomerEmail(email: string) {
  const collection = await getOrdersCollection();
  const nextEmail = email.trim().toLowerCase();
  const orders = await collection.find({ "customer.email": nextEmail }).sort({ createdAt: -1 }).toArray();
  return orders.map(toOrder);
}

export async function getOrder(id: string) {
  const collection = await getOrdersCollection();
  const order = await collection.findOne({ _id: id });
  return order ? toOrder(order) : null;
}

export async function createOrder(input: CreateOrderInput) {
  const collection = await getOrdersCollection();
  const now = new Date().toISOString();
  const items = input.items.map(normalizeItem).filter((item) => item.quantity > 0 && item.title.trim());

  if (items.length === 0) {
    throw new Error("At least one order item is required.");
  }

  if (!input.customer.name.trim() || !input.customer.phone.trim() || !input.customer.email.trim() || !input.customer.address.trim()) {
    throw new Error("Customer name, phone, email, and address are required.");
  }

  const totals = computeTotals(items);
  const isCashOnDelivery = input.paymentMethod === "cash_on_delivery";
  const order: OrderDocument = {
    _id: randomUUID(),
    id: randomUUID(),
    invoiceNumber: createInvoiceNumber(),
    customer: {
      name: input.customer.name.trim(),
      phone: input.customer.phone.trim(),
      email: input.customer.email.trim().toLowerCase(),
      address: input.customer.address.trim(),
    },
    items,
    paymentMethod: input.paymentMethod,
    shippingMethod: input.shippingMethod ?? "home_delivery",
    status: isCashOnDelivery ? "processing" : "pending",
    paymentStatus: "pending",
    gatewaySessionKey: undefined,
    notes: input.notes?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
    ...totals,
  };

  order._id = order.id;
  await collection.insertOne(order);
  return toOrder(order);
}

export async function updateOrderStatus(id: string, status: OrderStatus, paymentStatus?: PaymentStatus) {
  const collection = await getOrdersCollection();
  const existing = await collection.findOne({ _id: id });

  if (!existing) {
    throw new Error("Order not found.");
  }

  const now = new Date().toISOString();
  const next: OrderDocument = {
    ...existing,
    status,
    paymentStatus: paymentStatus ?? existing.paymentStatus,
    updatedAt: now,
    paidAt: status === "paid" ? now : existing.paidAt,
    shippedAt: status === "shipped" ? now : existing.shippedAt,
    deliveredAt: status === "delivered" ? now : existing.deliveredAt,
    canceledAt: status === "canceled" ? now : existing.canceledAt,
    refundedAt: status === "refunded" ? now : existing.refundedAt,
  };

  await collection.updateOne({ _id: id }, { $set: next });
  return toOrder(next);
}

export async function updateOrderGatewaySessionKey(id: string, sessionKey: string) {
  const collection = await getOrdersCollection();
  const existing = await collection.findOne({ _id: id });

  if (!existing) {
    throw new Error("Order not found.");
  }

  const next: OrderDocument = {
    ...existing,
    gatewaySessionKey: sessionKey,
    updatedAt: new Date().toISOString(),
  };

  await collection.updateOne({ _id: id }, { $set: next });
  return toOrder(next);
}
