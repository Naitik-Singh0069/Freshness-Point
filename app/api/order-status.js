import { getQueryValue, handlePreflight, sendJson } from "./_lib/http.js";
import { getSupabaseAdminClient } from "./_lib/supabase.js";

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;

  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const orderCode = getQueryValue(req, "orderCode");
  const accessToken = getQueryValue(req, "accessToken");

  if (!orderCode || !accessToken) {
    return sendJson(res, 400, {
      error: "orderCode and accessToken are required.",
    });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select(
        "order_code, order_status, payment_status, payment_method, total_paise, confirmed_at, created_at, updated_at"
      )
      .eq("order_code", orderCode)
      .eq("access_token", accessToken)
      .single();

    if (error || !data) {
      return sendJson(res, 404, { error: "Order not found." });
    }

    return sendJson(res, 200, {
      orderCode: data.order_code,
      status: data.order_status,
      paymentStatus: data.payment_status,
      paymentMethod: data.payment_method,
      totalPaise: Number(data.total_paise || 0),
      confirmedAt: data.confirmed_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Unable to fetch order status." });
  }
}
