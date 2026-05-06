import Razorpay from "razorpay";
import { getEnv } from "./_lib/env.js";
import { handlePreflight, parseJsonBody, sendJson } from "./_lib/http.js";
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from "./_lib/order.js";
import { getSupabaseAdminClient } from "./_lib/supabase.js";
import {
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
} from "../razorpay.config.js";

/**
 * POST body: { orderCode, accessToken }
 */
export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;

  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const body = await parseJsonBody(req);
  const orderCode = String(body.orderCode || "").trim();
  const accessToken = String(body.accessToken || "").trim();

  if (!orderCode || !accessToken) {
    return sendJson(res, 400, {
      error: "orderCode and accessToken are required.",
    });
  }

  const keyId = getEnv("RAZORPAY_KEY_ID", RAZORPAY_KEY_ID);
  const keySecret = getEnv("RAZORPAY_KEY_SECRET", RAZORPAY_KEY_SECRET);

  if (!keyId || !keySecret || keyId.includes("YOUR_KEY_ID")) {
    return sendJson(res, 500, {
      error: "Razorpay keys are not configured on the server.",
    });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data: orderRow, error: orderError } = await supabase
      .from("orders")
      .select(
        "id, order_code, access_token, payment_method, order_status, total_paise"
      )
      .eq("order_code", orderCode)
      .eq("access_token", accessToken)
      .single();

    if (orderError || !orderRow) {
      return sendJson(res, 404, { error: "Order not found." });
    }

    if (orderRow.payment_method !== PAYMENT_METHOD.ONLINE) {
      return sendJson(res, 400, {
        error: "Razorpay order can only be created for online payments.",
      });
    }

    if (
      orderRow.order_status !== ORDER_STATUS.PAYMENT_PENDING &&
      orderRow.order_status !== ORDER_STATUS.PAYMENT_FAILED
    ) {
      return sendJson(res, 400, {
        error: `Order status '${orderRow.order_status}' cannot start payment.`,
      });
    }

    const amount = Number(orderRow.total_paise || 0);
    if (!Number.isInteger(amount) || amount < 100) {
      return sendJson(res, 400, {
        error: "Order amount must be at least ₹1.",
      });
    }

    const rzp = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const razorpayOrder = await rzp.orders.create({
      amount,
      currency: "INR",
      receipt: orderRow.order_code,
      payment_capture: 1,
    });

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        razorpay_order_id: razorpayOrder.id,
        payment_status: PAYMENT_STATUS.UNPAID,
        order_status: ORDER_STATUS.PAYMENT_PENDING,
      })
      .eq("id", orderRow.id);

    if (updateError) {
      console.error(updateError);
      return sendJson(res, 500, {
        error: "Unable to store Razorpay order reference.",
      });
    }

    return sendJson(res, 200, {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
      orderCode: orderRow.order_code,
      razorpayKeyId: keyId,
    });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Order creation failed" });
  }
}