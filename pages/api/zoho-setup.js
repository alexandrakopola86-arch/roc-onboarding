// pages/api/zoho-setup.js
// Run this ONCE to create the 3 main folders and get their IDs
// Visit: https://roc-onboarding.vercel.app/api/zoho-setup?secret=roc2026setup

import { getAccessToken, getTeams, getWorkspaces, createFolder } from "../../lib/zoho";

export default async function handler(req, res) {
  // Simple security: require a secret param so only you can run this
  if (req.query.secret !== "roc2026setup") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const accessToken = await getAccessToken();

    // Step 1: Get teams
    const teams = await getTeams(accessToken);
    if (!teams || teams.length === 0) {
      return res.status(500).json({ error: "No teams found" });
    }
    const team = teams[0]; // Use first team
    const teamId = team.id;

    // Step 2: Get workspaces
    const workspaces = await getWorkspaces(accessToken, teamId);
    if (!workspaces || workspaces.length === 0) {
      return res.status(500).json({ error: "No workspaces found" });
    }
    const workspace = workspaces[0]; // Use first workspace
    const workspaceId = workspace.attributes.workspace_id;

    // Step 3: Create the 3 main folders
    const folders = ["Αγρότης", "Συνεταιρισμός", "Εταιρεία"];
    const createdFolders = {};

    for (const folderName of folders) {
      const folder = await createFolder(accessToken, workspaceId, folderName);
      createdFolders[folderName] = folder.id;
    }

    // Return the IDs — COPY THESE INTO YOUR .env.local !
    return res.status(200).json({
      success: true,
      message: "Folders created! Copy these IDs to your .env.local",
      teamId,
      workspaceId,
      folderIds: createdFolders,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
