import { getAccessToken, createFolder } from "../../lib/zoho";

export default async function handler(req, res) {
  if (req.query.secret !== "roc2026setup") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const accessToken = await getAccessToken();

    // Get user's own WorkDrive info
    const r1 = await fetch("https://workdrive.zoho.eu/api/v1/users/me", {
      headers: { Authorization: "Zoho-oauthtoken " + accessToken },
    });
    const d1 = await r1.json();

    return res.status(200).json({ debug: d1 });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
