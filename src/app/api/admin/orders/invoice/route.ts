import { NextResponse } from "next/server";
import { createInvoicePdfStream } from "@/lib/invoice-pdf";
import { getOrder, listOrdersByDateRange } from "@/lib/mongo-orders";

export const runtime = "nodejs";

function getRangeDates(preset: string | null) {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);

  switch (preset) {
    case "today":
      start.setHours(0, 0, 0, 0);
      break;
    case "month":
      start.setMonth(start.getMonth() - 1);
      break;
    case "year":
      start.setFullYear(start.getFullYear() - 1);
      break;
    default:
      return null;
  }

  return { startIso: start.toISOString(), endIso: end.toISOString() };
}

async function bufferFromStream(stream: NodeJS.ReadableStream) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get("orderId");
    const preset = url.searchParams.get("preset");

    let orders = [];
    let title = "Invoice";
    let subtitle = "Order packing copy";

    if (orderId) {
      const order = await getOrder(orderId);
      if (!order) {
        return NextResponse.json({ error: "Order not found." }, { status: 404 });
      }

      orders = [order];
      title = `Invoice ${order.invoiceNumber}`;
      subtitle = `${order.customer.name} • ${order.customer.email}`;
    } else {
      const range = getRangeDates(preset);

      if (!range) {
        return NextResponse.json({ error: "orderId or valid preset is required." }, { status: 400 });
      }

      orders = await listOrdersByDateRange(range.startIso, range.endIso);
      const label = preset === "today" ? "Today" : preset === "month" ? "Last 1 Month" : "Last 1 Year";
      title = `${label} Orders Invoice Pack`;
      subtitle = `${orders.length} order(s) included`;
    }

    const pdf = createInvoicePdfStream({
      orders,
      context: {
        title,
        subtitle,
        generatedAt: new Date().toLocaleString(),
      },
    });

    const buffer = await bufferFromStream(pdf);
    const fileName = orderId
      ? `invoice-${orderId}.pdf`
      : `orders-${preset || "custom"}-${new Date().toISOString().slice(0, 10)}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate invoice PDF." },
      { status: 500 },
    );
  }
}