import crypto from "crypto";
import { getEnv } from "./env.js";
import { sendJson } from "./http.js";

function timingSafeEqual(a, b) {
  const aBuf = Buffer.from(String(a || ""));
  const bBuf = Buffer.from(String(b || ""));
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function requireAdminApiKey(req, res) {
  const expected = getEnv("FP_ADMIN_API_KEY");
  if (!expected) {
    sendJson(res, 500, { error: "Admin API key is not configured." });
    return false;
  }

  const provided = req.headers["x-admin-key"];
  if (!provided || !timingSafeEqual(provided, expected)) {
    sendJson(res, 401, { error: "Unauthorized admin request." });
    return false;
  }

  return true;
}
