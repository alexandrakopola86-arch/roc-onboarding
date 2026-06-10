import { getAccessToken, createFolder } from "../../lib/zoho";

export default async function handler(req, res) {
  if (req.query.secret !== "roc2026setup") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const accessToken = await getAccessToken();

    // Try workspaces endpoint
    const wsRes = await fetch("https://workdrive.zoho.eu/api/v1/workspaces", {
      headers: { Authorization: "Zoho-oauthtoken " + accessToken },
    });
    const wsData = await wsRes.json();

    return res.status(200).json({ debug: wsData });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
