export type PaymentMethod = "sslcommerz" | "bkash" | "nagad" | "stripe" | "cash_on_delivery" | "prepayment";

export type ShippingMethod = "home_delivery" | "pickup";

export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "canceled" | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderCustomer = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

export type OrderItem = {
  productId: string;
  title: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  vatPercent: number;
  discountPercent: number;
  shippingCharge: number;
  lineSubtotal: number;
  lineVatAmount: number;
  lineDiscountAmount: number;
  lineShippingCharge: number;
  lineTotal: number;
  publishedByAdminEmail?: string;
  publishedByAdminUid?: string;
  publishedByAdminName?: string;
};

export type OrderTotals = {
  subtotal: number;
  vatAmount: number;
  discountAmount: number;
  shippingCharge: number;
  total: number;
};

export type Order = {
  id: string;
  invoiceNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  canceledAt?: string;
  refundedAt?: string;
} & OrderTotals;

export type CreateOrderInput = {
  customer: OrderCustomer;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  shippingMethod?: ShippingMethod;
  notes?: string;
};
