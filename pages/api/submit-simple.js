export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = req.body;
    const r = await fetch("https://formspree.io/f/xqeoddwd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, _subject: "Νεα εγγραφη RoC Onboarding" }),
    });
    const data = await r.json();
    return res.status(200).json({ success: true, formspree: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
