import crypto from "crypto";

export const ORDER_STATUS = {
  PAYMENT_PENDING: "payment_pending",
  AWAITING_CONFIRMATION: "awaiting_confirmation",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  OUT_FOR_DELIVERY: "out_for_delivery",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  REJECTED: "rejected",
  PAYMENT_FAILED: "payment_failed",
};

export const PAYMENT_STATUS = {
  UNPAID: "unpaid",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
};

export const PAYMENT_METHOD = {
  COD: "cod",
  ONLINE: "online",
};

export function formatMoneyFromPaise(paise) {
  const amount = Number(paise || 0) / 100;
  return `₹${amount.toFixed(2)}`;
}

export function buildOrderCode() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `FP-${stamp}-${rand}`;
}

export function buildAccessToken() {
  return crypto.randomBytes(18).toString("hex");
}

export function sanitizeWhatsAppNumber(numberLike) {
  return String(numberLike || "")
    .replace(/[^\d]/g, "")
    .replace(/^0+/, "");
}

export function buildWhatsAppMessage({
  orderCode,
  customerName,
  customerMobile,
  city,
  address,
  landmark,
  pincode,
  instructions,
  lineItems,
  subtotalPaise,
  paymentLine,
}) {
  const detailLines = lineItems.map(
    (line) =>
      `• ${line.item_name} × ${line.quantity} — ${formatMoneyFromPaise(
        line.line_total_paise
      )}`
  );

  return [
    "🛒 *Freshness Point Order*",
    "",
    `🧾 *Order Ref:* ${orderCode}`,
    "",
    `👤 *Customer:* ${customerName}`,
    `📱 *Mobile:* ${customerMobile}`,
    `📍 *City:* ${city}`,
    `🏠 *Address:* ${address}`,
    `🗺️ *Landmark:* ${landmark || "Not provided"}`,
    `📮 *Pincode:* ${pincode}`,
    "",
    "🍽️ *Order Details:*",
    detailLines.join("\n"),
    "",
    `💰 *Total:* ${formatMoneyFromPaise(subtotalPaise)}`,
    `💳 *Payment:* ${paymentLine}`,
    "",
    `📝 *Instructions:* ${instructions || "None"}`,
    "",
    "_Verify this order via admin dashboard using the Order Ref._",
  ].join("\n");
}

export function buildWhatsAppUrl(number, messageText) {
  const clean = sanitizeWhatsAppNumber(number);
  if (!clean) return "";
  return `https://wa.me/${clean}?text=${encodeURIComponent(messageText)}`;
}
