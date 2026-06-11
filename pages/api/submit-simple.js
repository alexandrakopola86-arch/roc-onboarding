export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = req.body;
    const onb = body.onboarding || {};
    const name = onb.firstName ? onb.firstName + " " + (onb.lastName || "") : onb.orgName || "Αγνωστος";

    const eq = body.equipment || {};
    let equipmentText = "";
    Object.entries(eq).forEach(([machine, data]) => {
      equipmentText += `\n  ${machine}: ${JSON.stringify(data)}`;
    });

    const fields = body.fields || {};
    let fieldsText = "";
    Object.entries(fields).forEach(([plot, data]) => {
      fieldsText += `\n  ${plot}: ${JSON.stringify(data)}`;
    });

    const message = `
ΝΕΟΣ ΕΓΓΕΓΡΑΜΜΕΝΟΣ - RoC Onboarding
=====================================

ΤΥΠΟΣ: ${onb.type || "-"}
ΟΝΟΜΑ: ${name}
EMAIL: ${onb.email || "-"}
ΤΗΛΕΦΩΝΟ: ${onb.phone || "-"}
ΠΕΡΙΟΧΗ: ${onb.region || "-"}
ΜΕΓΕΘΟΣ: ${onb.farm_size || "-"}
ΕΚΤΑΣΗ: ${onb.hectares || "-"} ha
ΑΓΡΟΤΕΜΑΧΙΑ: ${onb.plots || "-"}
ΚΙΝΗΤΡΟ: ${onb.motivation || "-"}
ΕΞΟΠΛΙΣΜΟΣ: ${onb.equipment || "-"}
ΠΗΓΗ: ${onb.source || "-"}

--- ΕΞΟΠΛΙΣΜΟΣ ΛΕΠΤΟΜΕΡΕΙΕΣ ---${equipmentText || " -"}

--- ΑΓΡΟΤΕΜΑΧΙΑ ΛΕΠΤΟΜΕΡΕΙΕΣ ---${fieldsText || " -"}
    `.trim();

    const r = await fetch("https://formspree.io/f/xqeoddwd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _subject: "Νεα εγγραφη RoC: " + name + " (" + (onb.type || "-") + ")",
        message: message,
        name: name,
        email: onb.email || "no-reply@rootsofcarbon.gr",
      }),
    });

    await r.json();
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
