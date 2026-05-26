import PDFDocument from "pdfkit/js/pdfkit.standalone.js";
import type { Order } from "@/types/order";

type InvoiceContext = {
  title: string;
  subtitle?: string;
  generatedAt: string;
};

const colors = {
  accent: "#d6b36a",
  accentSoft: "#dccba6",
  text: "#24180f",
  label: "#6f5430",
  line: "#d8cab4",
  headerLine: "#3a2a16",
};

function formatCurrency(value: number) {
  return `Tk ${value.toFixed(2)}`;
}

function formatText(value: string | undefined | null) {
  return value?.trim() || "N/A";
}

function formatStatus(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function drawSectionTitle(document: PDFKit.PDFDocument, title: string, x: number, y: number) {
  document
    .fillColor(colors.accent)
    .font("Helvetica-Bold")
    .fontSize(10.5)
    .text(title.toUpperCase(), x, y, { characterSpacing: 0.8 });
}

function ensureSpace(document: PDFKit.PDFDocument, requiredHeight: number) {
  if (document.y + requiredHeight > document.page.height - document.page.margins.bottom) {
    document.addPage();
  }
}

function drawDivider(document: PDFKit.PDFDocument, y: number) {
  document
    .moveTo(document.page.margins.left, y)
    .lineTo(document.page.width - document.page.margins.right, y)
    .lineWidth(0.7)
    .strokeColor(colors.line)
    .stroke();
}

function drawKeyValue(document: PDFKit.PDFDocument, label: string, value: string, x: number, y: number, width = 220) {
  document.fillColor(colors.label).font("Helvetica").fontSize(8.25).text(label, x, y, { width });
  document.fillColor(colors.text).font("Helvetica-Bold").fontSize(10.25).text(value, x, y + 11, { width });
}

function drawInvoiceHeader(document: PDFKit.PDFDocument, context: InvoiceContext) {
  const left = document.page.margins.left;
  const top = document.page.margins.top;
  const right = document.page.width - document.page.margins.right;

  document.rect(left, top, right - left, 78).fillAndStroke("#130e0a", "#3a2a16");
  document.fillColor(colors.accent).font("Helvetica-Bold").fontSize(22).text("Oud.co", left + 16, top + 14);
  document.fillColor("#f5e6c2").font("Helvetica-Bold").fontSize(16).text(context.title, left + 16, top + 40);
  if (context.subtitle) {
    document.fillColor("#dccba6").font("Helvetica").fontSize(9).text(context.subtitle, left + 16, top + 58, { width: 320 });
  }
  document.fillColor("#a89267").font("Helvetica").fontSize(9).text(`Generated: ${context.generatedAt}`, right - 190, top + 16, { width: 170, align: "right" });
}

function drawOrderSummary(document: PDFKit.PDFDocument, order: Order) {
  const left = document.page.margins.left;
  const contentWidth = document.page.width - document.page.margins.left - document.page.margins.right;
  const gap = 14;
  const columnWidth = (contentWidth - gap * 2) / 3;
  const top = document.y + 4;

  drawSectionTitle(document, "Order & Customer Details", left, top);
  document.y = top + 18;

  drawKeyValue(document, "Invoice", order.invoiceNumber, left, document.y, columnWidth);
  drawKeyValue(document, "Order Status", formatStatus(order.status), left + columnWidth + gap, document.y, columnWidth);
  drawKeyValue(document, "Payment", formatStatus(order.paymentStatus), left + (columnWidth + gap) * 2, document.y, columnWidth);
  document.y += 36;

  drawKeyValue(document, "Customer Name", order.customer.name, left, document.y, columnWidth);
  drawKeyValue(document, "Customer Email", order.customer.email, left + columnWidth + gap, document.y, columnWidth);
  drawKeyValue(document, "Phone", order.customer.phone, left + (columnWidth + gap) * 2, document.y, columnWidth);
  document.y += 38;

  drawKeyValue(document, "Address", order.customer.address, left, document.y, columnWidth * 2 + gap);
  drawKeyValue(document, "Payment Method", formatStatus(order.paymentMethod), left + (columnWidth + gap) * 2, document.y, columnWidth);
  document.y += 52;
}

function drawItems(document: PDFKit.PDFDocument, order: Order) {
  const left = document.page.margins.left;
  const startY = document.y;

  drawSectionTitle(document, "Items", left, startY);
  document.y = startY + 18;

  const tableTop = document.y;
  const widths = [24, 250, 52, 88, 101];
  const headers = ["#", "Product Details", "Qty", "Unit Price", "Line Total"];
  let cursorX = left;

  document.fillColor(colors.label).font("Helvetica-Bold").fontSize(8.75);
  headers.forEach((header, index) => {
    document.text(header, cursorX, tableTop, {
      width: widths[index],
      align: index === 0 || index === 1 ? "left" : "right",
    });
    cursorX += widths[index];
  });

  drawDivider(document, tableTop + 14);
  document.y = tableTop + 20;

  order.items.forEach((item, index) => {
    const titleHeight = document.heightOfString(item.title, { width: widths[1] });
    const rowHeight = Math.max(20, titleHeight) + 10;

    ensureSpace(document, rowHeight + 8);
    const rowY = document.y;

    document.fillColor(colors.text).font("Helvetica").fontSize(8.75);
    document.text(String(index + 1), left, rowY, { width: widths[0], align: "left" });
    document.text(item.title, left + widths[0], rowY, { width: widths[1] });
    document.text(String(item.quantity), left + widths[0] + widths[1], rowY, { width: widths[2], align: "right" });
    document.text(formatCurrency(item.unitPrice), left + widths[0] + widths[1] + widths[2], rowY, { width: widths[3], align: "right" });
    document.text(formatCurrency(item.lineTotal), left + widths[0] + widths[1] + widths[2] + widths[3], rowY, { width: widths[4], align: "right" });

    document.y = rowY + rowHeight;
  });
}

function drawTotals(document: PDFKit.PDFDocument, order: Order) {
  ensureSpace(document, 80);
  const left = document.page.margins.left;
  const top = document.y + 8;
  drawSectionTitle(document, "Totals", left, top);

  const boxY = top + 18;
  const contentWidth = document.page.width - document.page.margins.left - document.page.margins.right;
  const valueWidth = 120;
  const labelWidth = contentWidth - valueWidth;
  const values = [
    ["Subtotal", formatCurrency(order.subtotal)],
    ["VAT", formatCurrency(order.vatAmount)],
    ["Discount", `- ${formatCurrency(order.discountAmount)}`],
    ["Shipping", formatCurrency(order.shippingCharge)],
    ["Grand Total", formatCurrency(order.total)],
  ] as const;

  let currentY = boxY;
  values.forEach(([label, value], index) => {
    const isGrandTotal = index === values.length - 1;
    document.fillColor(isGrandTotal ? colors.text : colors.label).font(isGrandTotal ? "Helvetica-Bold" : "Helvetica").fontSize(isGrandTotal ? 11 : 9);
    document.text(label, left, currentY, { width: labelWidth });
    document.text(value, left + labelWidth, currentY, { width: valueWidth, align: "right" });
    currentY += isGrandTotal ? 18 : 15;
  });

  document.y = currentY + 8;
}

function addOrderInvoice(document: PDFKit.PDFDocument, order: Order, context: InvoiceContext, isFirstPage = false) {
  if (!isFirstPage) {
    document.addPage();
  }

  drawInvoiceHeader(document, context);
  document.y = document.page.margins.top + 92;
  drawOrderSummary(document, order);
  drawItems(document, order);
  drawTotals(document, order);
  drawDivider(document, document.y + 8);
}

export function createInvoicePdfStream(options: { orders: Order[]; context: InvoiceContext }) {
  const document = new PDFDocument({
    size: "A4",
    margin: 40,
    bufferPages: true,
  });

  options.orders.forEach((order, index) => {
    addOrderInvoice(document, order, options.context, index === 0);
  });

  if (options.orders.length === 0) {
    drawInvoiceHeader(document, options.context);
    document.moveDown(4).fillColor(colors.text).font("Helvetica").fontSize(11).text("No orders found for the selected range.", { align: "center" });
  }

  document.end();
  return document;
}