// Run this ONCE to create the 3 main folders and get their IDs
// Visit: https://roc-onboarding.vercel.app/api/zoho-setup?secret=roc2026setup

import { getAccessToken, createFolder } from "../../lib/zoho";

export default async function handler(req, res) {
  if (req.query.secret !== "roc2026setup") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const accessToken = await getAccessToken();

    // Get the root workspace ID directly
    const wsRes = await fetch("https://workdrive.zoho.eu/api/v1/privatespace", {
      headers: { Authorization: "Zoho-oauthtoken " + accessToken },
    });
    const wsData = await wsRes.json();
    console.log("privatespace response:", JSON.stringify(wsData));

    if (!wsData.data) {
      return res.status(500).json({ error: "No privatespace found", raw: wsData });
    }

    const parentId = wsData.data.id;

    // Create the 3 main folders
    const folders = ["Αγρότης", "Συνεταιρισμός", "Εταιρεία"];
    const createdFolders = {};

    for (const folderName of folders) {
      const folder = await createFolder(accessToken, parentId, folderName);
      createdFolders[folderName] = folder.id;
    }

    return res.status(200).json({
      success: true,
      message: "Folders created! Copy these IDs to your Vercel env vars",
      parentId,
      folderIds: createdFolders,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
