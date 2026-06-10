export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  return res.status(200).json({ 
    received: req.body,
    env_check: {
      agrotis: !!process.env.ZOHO_FOLDER_AGROTIS,
      synetairismos: !!process.env.ZOHO_FOLDER_SYNETAIRISMOS,
      etaireia: !!process.env.ZOHO_FOLDER_ETAIREIA,
    }
  });
}
