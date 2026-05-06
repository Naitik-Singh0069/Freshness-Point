import crypto from "crypto";
import { getEnv } from "./_lib/env.js";
import { handlePreflight, parseJsonBody, sendJson } from "./_lib/http.js";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "./_lib/order.js";
import { getSupabaseAdminClient } from "./_lib/supabase.js";
import { RAZORPAY_KEY_SECRET } from "../razorpay.config.js";

function timingSafeEqual(a, b) {
  const aBuf = Buffer.from(String(a || ""));
  const bBuf = Buffer.from(String(b || ""));
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;

  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const body = await parseJsonBody(req);
    const orderCode = String(body.orderCode || "").trim();
    const accessToken = String(body.accessToken || "").trim();
    const razorpayOrderId = String(body.razorpay_order_id || "").trim();
    const razorpayPaymentId = String(body.razorpay_payment_id || "").trim();
    const razorpaySignature = String(body.razorpay_signature || "").trim();

    if (
      !orderCode ||
      !accessToken ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return sendJson(res, 400, {
        error:
          "orderCode, accessToken, razorpay_order_id, razorpay_payment_id and razorpay_signature are required.",
      });
    }

    const secret = getEnv("RAZORPAY_KEY_SECRET", RAZORPAY_KEY_SECRET);
    if (!secret || secret.includes("YOUR_KEY_SECRET_HERE")) {
      return sendJson(res, 500, {
        error: "Razorpay secret is not configured on the server.",
      });
    }

    const supabase = getSupabaseAdminClient();
    const { data: orderRow, error: orderError } = await supabase
      .from("orders")
      .select(
        "id, order_code, access_token, payment_method, payment_status, order_status, customer_name, customer_mobile, city, address, landmark, pincode, instructions, subtotal_paise, razorpay_order_id"
      )
      .eq("order_code", orderCode)
      .eq("access_token", accessToken)
      .single();

    if (orderError || !orderRow) {
      return sendJson(res, 404, { error: "Order not found." });
    }

    if (orderRow.payment_method !== PAYMENT_METHOD.ONLINE) {
      return sendJson(res, 400, {
        error: "This order is not configured for online payment.",
      });
    }

    if (!orderRow.razorpay_order_id || orderRow.razorpay_order_id !== razorpayOrderId) {
      return sendJson(res, 400, {
        error: "Razorpay order reference does not match this order.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (!timingSafeEqual(expectedSignature, razorpaySignature)) {
      await supabase
        .from("orders")
        .update({
          payment_status: PAYMENT_STATUS.FAILED,
          order_status: ORDER_STATUS.PAYMENT_FAILED,
        })
        .eq("id", orderRow.id);

      return sendJson(res, 400, { error: "Invalid Razorpay signature." });
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: PAYMENT_STATUS.PAID,
        order_status: ORDER_STATUS.AWAITING_CONFIRMATION,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
      })
      .eq("id", orderRow.id);

    if (updateError) {
      console.error(updateError);
      return sendJson(res, 500, { error: "Unable to update payment status." });
    }

    const { data: orderItems, error: itemError } = await supabase
      .from("order_items")
      .select("item_name, quantity, line_total_paise")
      .eq("order_id", orderRow.id);

    if (itemError) {
      console.error(itemError);
      return sendJson(res, 500, { error: "Unable to load order line items." });
    }

    const waNumber = getEnv("FP_WHATSAPP_NUMBER", "919129383812");
    const message = buildWhatsAppMessage({
      orderCode: orderRow.order_code,
      customerName: orderRow.customer_name,
      customerMobile: orderRow.customer_mobile,
      city: orderRow.city,
      address: orderRow.address,
      landmark: orderRow.landmark,
      pincode: orderRow.pincode,
      instructions: orderRow.instructions,
      lineItems: (orderItems || []).map((line) => ({
        item_name: line.item_name,
        quantity: line.quantity,
        line_total_paise: line.line_total_paise,
      })),
      subtotalPaise: Number(orderRow.subtotal_paise || 0),
      paymentLine: `Paid online (Razorpay: ${razorpayPaymentId})`,
    });

    return sendJson(res, 200, {
      orderCode: orderRow.order_code,
      accessToken: orderRow.access_token,
      status: ORDER_STATUS.AWAITING_CONFIRMATION,
      paymentStatus: PAYMENT_STATUS.PAID,
      whatsappUrl: buildWhatsAppUrl(waNumber, message),
    });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Unable to verify payment." });
  }
}
