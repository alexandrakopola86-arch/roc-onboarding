import { getAccessToken, createFolder } from "../../lib/zoho";

export default async function handler(req, res) {
  if (req.query.secret !== "roc2026setup") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const accessToken = await getAccessToken();
    const teamId = "343ekec77de0592f34fbfbd3703a6e83bfdbb";

    // Get team folders
    const r1 = await fetch(`https://workdrive.zoho.eu/api/v1/teams/${teamId}/folders`, {
      headers: { Authorization: "Zoho-oauthtoken " + accessToken },
    });
    const d1 = await r1.json();

    return res.status(200).json({ debug: d1 });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
