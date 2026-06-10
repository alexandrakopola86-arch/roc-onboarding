import { getAccessToken, createFolder } from "../../lib/zoho";

export default async function handler(req, res) {
  if (req.query.secret !== "roc2026setup") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const accessToken = await getAccessToken();
    const parentId = "56pih6ac45089d8c34554882220a829d09656";

    const folders = ["Αγρότης", "Συνεταιρισμός", "Εταιρεία"];
    const createdFolders = {};

    for (const folderName of folders) {
      const folder = await createFolder(accessToken, parentId, folderName);
      createdFolders[folderName] = folder.id;
    }

    return res.status(200).json({
      success: true,
      message: "Folders created! Add these to Vercel env vars",
      parentId,
      folderIds: createdFolders,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
