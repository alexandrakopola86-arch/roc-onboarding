ς// pages/api/submit.js
// Called when the form is submitted — creates a subfolder in the right Zoho folder

import { getAccessToken, createFolder, listFiles } from "../../lib/zoho";

// Map from form userType value to Zoho folder ID (set in .env.local after running zoho-setup)
const FOLDER_IDS = {
  farmer: process.env.ZOHO_FOLDER_AGROTIS,       // Αγρότης
  cooperative: process.env.ZOHO_FOLDER_SYNETAIRISMOS, // Συνεταιρισμός
  company: process.env.ZOHO_FOLDER_ETAIREIA,      // Εταιρεία
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;

    // Extract the key fields from the form submission
    const rawType = body.onboarding?.type || body.userType || "";
  const typeMap = { "Μεμονωμένος αγρότης": "farmer", "Αγρότης": "farmer", "Συνεταιρισμός": "cooperative", "Εταιρεία": "company" };
  const userType = typeMap[rawType] || rawType; // "farmer" | "cooperative" | "company"
    
χconst name =
      body.fullName || (body.onboarding?.firstName ? body.onboarding.firstName + " " + (body.onboarding.lastName || "") : null) || // Αγρότης: πλήρες όνομα
      body.cooperativeName || // Συνεταιρισμός: όνομα συνεταιρισμού
      body.companyName ||     // Εταιρεία: όνομα εταιρείας
      "Άγνωστος";

    if (!userType || !FOLDER_IDS[userType]) {
      return res.status(400).json({ error: "Invalid or missing userType" });
    }

    const parentFolderId = FOLDER_IDS[userType];

    // Get fresh access token
    const accessToken = await getAccessToken();

    // Check if folder already exists (avoid duplicates)
    const existingFiles = await listFiles(accessToken, parentFolderId);
    const existing = existingFiles.find(
      (f) => f.attributes?.name?.toLowerCase() === name.toLowerCase()
    );

    let folder;
    if (existing) {
      // Folder already exists — use it
      folder = existing;
    } else {
      // Create new subfolder with the person/company name
      // Add timestamp to avoid duplicates if same name submits twice
      const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const folderName = `${name} - ${timestamp}`;
      folder = await createFolder(accessToken, parentFolderId, folderName);
    }

    return res.status(200).json({
      success: true,
      folderId: folder.id,
      folderName: folder.attributes?.name,
      message: `Folder created/found in Zoho WorkDrive`,
    });
  } catch (err) {
    console.error("Zoho submit error:", err);
    return res.status(500).json({ error: err.message });
  }
}
