import { getEnv } from "./_lib/env.js";
import {
  handlePreflight,
  normalizeText,
  parseJsonBody,
  sendJson,
  toPositiveInt,
} from "./_lib/http.js";
import {
  buildAccessToken,
  buildOrderCode,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "./_lib/order.js";
import { getSupabaseAdminClient } from "./_lib/supabase.js";

const ALLOWED_CITIES = new Set(["Lucknow", "Pratapgarh"]);

function normalizeItemKey(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateCustomer(customer) {
  const fullName = normalizeText(customer.fullName, 120);
  const mobile = String(customer.mobile || "").replace(/[^\d]/g, "");
  const city = normalizeText(customer.city, 60);
  const address = normalizeText(customer.address, 500);
  const landmark = normalizeText(customer.landmark, 200);
  const pincode = String(customer.pincode || "").replace(/[^\d]/g, "");
  const instructions = normalizeText(customer.instructions, 600);

  if (!fullName) return { ok: false, error: "Customer full name is required." };
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return { ok: false, error: "Enter a valid 10-digit Indian mobile number." };
  }
  if (!ALLOWED_CITIES.has(city)) {
    return { ok: false, error: "City must be Lucknow or Pratapgarh." };
  }
  if (address.length < 20) {
    return { ok: false, error: "Address must be at least 20 characters long." };
  }
  if (!/^\d{6}$/.test(pincode)) {
    return { ok: false, error: "Enter a valid 6-digit pincode." };
  }

  return {
    ok: true,
    value: {
      fullName,
      mobile,
      city,
      address,
      landmark,
      pincode,
      instructions,
    },
  };
}

function aggregateCartItems(rawItems) {
  if (!Array.isArray(rawItems)) return null;

  const aggregated = new Map();
  for (const row of rawItems) {
    const key = normalizeItemKey(row?.itemKey || row?.slug || row?.name);
    const qty = toPositiveInt(row?.qty || row?.quantity);
    if (!key || !qty || qty > 20) return null;

    aggregated.set(key, (aggregated.get(key) || 0) + qty);
  }

  if (aggregated.size === 0) return null;
  return aggregated;
}

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;

  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const payload = await parseJsonBody(req);
    const cartMap = aggregateCartItems(payload.items);
    if (!cartMap) {
      return sendJson(res, 400, {
        error: "Invalid cart. Each item must have a valid key and quantity.",
      });
    }

    const paymentMethod = String(payload.paymentMethod || "").trim();
    if (
      paymentMethod !== PAYMENT_METHOD.COD &&
      paymentMethod !== PAYMENT_METHOD.ONLINE
    ) {
      return sendJson(res, 400, {
        error: "paymentMethod must be either 'cod' or 'online'.",
      });
    }

    const customerResult = validateCustomer(payload.customer || {});
    if (!customerResult.ok) {
      return sendJson(res, 400, { error: customerResult.error });
    }

    const customer = customerResult.value;
    const itemSlugs = Array.from(cartMap.keys());

    const supabase = getSupabaseAdminClient();
    const { data: menuRows, error: menuError } = await supabase
      .from("menu_items")
      .select("slug, name, price_paise, is_active")
      .in("slug", itemSlugs)
      .eq("is_active", true);

    if (menuError) {
      console.error(menuError);
      return sendJson(res, 500, { error: "Unable to validate menu pricing." });
    }

    const menuBySlug = new Map((menuRows || []).map((row) => [row.slug, row]));
    if (menuBySlug.size !== itemSlugs.length) {
      return sendJson(res, 400, {
        error:
          "One or more items are unavailable or inactive. Please refresh the menu.",
      });
    }

    const lineItems = [];
    let subtotalPaise = 0;

    for (const slug of itemSlugs) {
      const menuRow = menuBySlug.get(slug);
      const quantity = cartMap.get(slug) || 0;
      const unitPricePaise = Number(menuRow.price_paise || 0);
      const lineTotalPaise = unitPricePaise * quantity;

      subtotalPaise += lineTotalPaise;
      lineItems.push({
        item_slug: slug,
        item_name: menuRow.name,
        unit_price_paise: unitPricePaise,
        quantity,
        line_total_paise: lineTotalPaise,
      });
    }

    if (subtotalPaise < 100) {
      return sendJson(res, 400, {
        error: "Minimum order value is ₹1.",
      });
    }

    const orderCode = buildOrderCode();
    const accessToken = buildAccessToken();
    const orderStatus =
      paymentMethod === PAYMENT_METHOD.ONLINE
        ? ORDER_STATUS.PAYMENT_PENDING
        : ORDER_STATUS.AWAITING_CONFIRMATION;

    const { data: orderRow, error: orderInsertError } = await supabase
      .from("orders")
      .insert({
        order_code: orderCode,
        access_token: accessToken,
        customer_name: customer.fullName,
        customer_mobile: customer.mobile,
        city: customer.city,
        address: customer.address,
        landmark: customer.landmark || "",
        pincode: customer.pincode,
        instructions: customer.instructions || "",
        payment_method: paymentMethod,
        payment_status: PAYMENT_STATUS.UNPAID,
        order_status: orderStatus,
        subtotal_paise: subtotalPaise,
        total_paise: subtotalPaise,
        currency: "INR",
      })
      .select("id, order_code, access_token, payment_method, order_status")
      .single();

    if (orderInsertError || !orderRow) {
      console.error(orderInsertError);
      return sendJson(res, 500, { error: "Unable to create order." });
    }

    const orderItemRows = lineItems.map((line) => ({
      order_id: orderRow.id,
      ...line,
    }));
    const { error: itemInsertError } = await supabase
      .from("order_items")
      .insert(orderItemRows);

    if (itemInsertError) {
      console.error(itemInsertError);
      await supabase.from("orders").delete().eq("id", orderRow.id);
      return sendJson(res, 500, { error: "Unable to create order line items." });
    }

    let whatsappUrl = "";
    if (paymentMethod === PAYMENT_METHOD.COD) {
      const waNumber = getEnv("FP_WHATSAPP_NUMBER", "919129383812");
      const message = buildWhatsAppMessage({
        orderCode,
        customerName: customer.fullName,
        customerMobile: customer.mobile,
        city: customer.city,
        address: customer.address,
        landmark: customer.landmark,
        pincode: customer.pincode,
        instructions: customer.instructions,
        lineItems: orderItemRows,
        subtotalPaise,
        paymentLine: "Cash on Delivery",
      });
      whatsappUrl = buildWhatsAppUrl(waNumber, message);
    }

    return sendJson(res, 200, {
      orderCode,
      accessToken,
      status: orderRow.order_status,
      paymentMethod,
      paymentStatus: PAYMENT_STATUS.UNPAID,
      subtotalPaise,
      totalPaise: subtotalPaise,
      totalRupees: Number((subtotalPaise / 100).toFixed(2)),
      whatsappUrl,
    });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Unable to create order." });
  }
}
