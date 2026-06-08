// lib/zoho.js
// Helper functions for Zoho WorkDrive API

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;

/**
 * Get a fresh access token using the refresh token
 */
export async function getAccessToken() {
  const res = await fetch("https://accounts.zoho.eu/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: ZOHO_REFRESH_TOKEN,
      client_id: ZOHO_CLIENT_ID,
      client_secret: ZOHO_CLIENT_SECRET,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error("Failed to get access token: " + JSON.stringify(data));
  }
  return data.access_token;
}

/**
 * Get all teams for the authenticated user
 */
export async function getTeams(accessToken) {
  const res = await fetch("https://workdrive.zoho.eu/api/v1/users/me/teams", {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
  });
  const data = await res.json();
  return data.data;
}

/**
 * Get all workspaces for a team
 */
export async function getWorkspaces(accessToken, teamId) {
  const res = await fetch(
    `https://workdrive.zoho.eu/api/v1/teams/${teamId}/workspaces`,
    {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
    }
  );
  const data = await res.json();
  return data.data;
}

/**
 * Create a folder inside a parent folder
 * @param {string} accessToken
 * @param {string} parentId - ID of the parent folder or workspace
 * @param {string} name - Name of the new folder
 */
export async function createFolder(accessToken, parentId, name) {
  const res = await fetch("https://workdrive.zoho.eu/api/v1/files", {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        attributes: {
          name: name,
          parent_id: parentId,
        },
        type: "files",
      },
    }),
  });

  const data = await res.json();
  if (!data.data) {
    throw new Error("Failed to create folder: " + JSON.stringify(data));
  }
  return data.data;
}

/**
 * List files/folders inside a folder
 */
export async function listFiles(accessToken, folderId) {
  const res = await fetch(
    `https://workdrive.zoho.eu/api/v1/files/${folderId}/files`,
    {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
    }
  );
  const data = await res.json();
  return data.data || [];
}
