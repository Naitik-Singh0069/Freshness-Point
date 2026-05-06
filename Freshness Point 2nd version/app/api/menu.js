import { handlePreflight, sendJson } from "./_lib/http.js";
import { getSupabaseAdminClient } from "./_lib/supabase.js";

function mapMenuItem(row) {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description || "",
    price: Number((Number(row.price_paise || 0) / 100).toFixed(2)),
    badge: row.badge || null,
    image: row.image_url || "",
    isCombo: !!row.is_combo,
    isFeatured: !!row.is_featured,
    isActive: !!row.is_active,
    sortOrder: Number(row.sort_order || 0),
  };
}

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;

  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        "slug, name, category, description, price_paise, badge, image_url, is_combo, is_featured, is_active, sort_order"
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      return sendJson(res, 500, { error: "Unable to fetch menu items." });
    }

    return sendJson(res, 200, { items: (data || []).map(mapMenuItem) });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Unable to fetch menu items." });
  }
}
