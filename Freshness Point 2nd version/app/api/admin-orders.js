import { requireAdminApiKey } from "./_lib/admin.js";
import { getQueryValue, handlePreflight, sendJson } from "./_lib/http.js";
import { getSupabaseAdminClient } from "./_lib/supabase.js";

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;

  if (!requireAdminApiKey(req, res)) return;

  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const rawLimit = Number(getQueryValue(req, "limit") || 50);
  const limit = Math.max(1, Math.min(200, Number.isInteger(rawLimit) ? rawLimit : 50));

  try {
    const supabase = getSupabaseAdminClient();
    const { data: orders, error: orderError } = await supabase
      .from("orders")
      .select(
        "id, order_code, customer_name, customer_mobile, city, address, landmark, pincode, instructions, payment_method, payment_status, order_status, subtotal_paise, total_paise, razorpay_order_id, razorpay_payment_id, confirmed_at, created_at, updated_at"
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (orderError) {
      console.error(orderError);
      return sendJson(res, 500, { error: "Unable to load orders." });
    }

    const orderIds = (orders || []).map((row) => row.id);
    let itemRows = [];
    if (orderIds.length > 0) {
      const { data, error: itemError } = await supabase
        .from("order_items")
        .select(
          "order_id, item_slug, item_name, unit_price_paise, quantity, line_total_paise"
        )
        .in("order_id", orderIds);

      if (itemError) {
        console.error(itemError);
        return sendJson(res, 500, { error: "Unable to load order line items." });
      }
      itemRows = data || [];
    }

    const itemMap = new Map();
    for (const item of itemRows) {
      const key = item.order_id;
      if (!itemMap.has(key)) itemMap.set(key, []);
      itemMap.get(key).push(item);
    }

    const payload = (orders || []).map((order) => ({
      orderCode: order.order_code,
      customerName: order.customer_name,
      customerMobile: order.customer_mobile,
      city: order.city,
      address: order.address,
      landmark: order.landmark,
      pincode: order.pincode,
      instructions: order.instructions,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      status: order.order_status,
      subtotalPaise: Number(order.subtotal_paise || 0),
      totalPaise: Number(order.total_paise || 0),
      razorpayOrderId: order.razorpay_order_id,
      razorpayPaymentId: order.razorpay_payment_id,
      confirmedAt: order.confirmed_at,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items: (itemMap.get(order.id) || []).map((item) => ({
        slug: item.item_slug,
        name: item.item_name,
        quantity: Number(item.quantity || 0),
        unitPricePaise: Number(item.unit_price_paise || 0),
        lineTotalPaise: Number(item.line_total_paise || 0),
      })),
    }));

    return sendJson(res, 200, { orders: payload });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Unable to load orders." });
  }
}
