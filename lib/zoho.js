const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;

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
  if (!data.access_token) throw new Error("Failed: " + JSON.stringify(data));
  return data.access_token;
}

export async function getTeams(accessToken) {
  const res = await fetch("https://workdrive.zoho.eu/api/v1/users/me/teams", {
    headers: { Authorization: "Zoho-oauthtoken " + accessToken },
  });
  return (await res.json()).data;
}

export async function getWorkspaces(accessToken, teamId) {
  const res = await fetch("https://workdrive.zoho.eu/api/v1/teams/" + teamId + "/workspaces", {
    headers: { Authorization: "Zoho-oauthtoken " + accessToken },
  });
  return (await res.json()).data;
}

export async function createFolder(accessToken, parentId, name) {
  const res = await fetch("https://workdrive.zoho.eu/api/v1/files", {
    method: "POST",
    headers: {
      Authorization: "Zoho-oauthtoken " + accessToken,
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify({ data: { attributes: { name, parent_id: parentId }, type: "files" } }),
  });
  const data = await res.json();
  if (!data.data) throw new Error("Failed: " + JSON.stringify(data));
  return data.data;
}

export async function listFiles(accessToken, folderId) {
  const res = await fetch("https://workdrive.zoho.eu/api/v1/files/" + folderId + "/files", {
    headers: { Authorization: "Zoho-oauthtoken " + accessToken },
  });
  return (await res.json()).data || [];
}

export async function findOrCreateFolder(accessToken, parentId, name) {
  const existingFiles = await listFiles(accessToken, parentId);
  const existing = existingFiles.find(
    (f) => f.attributes?.name?.toLowerCase() === name.toLowerCase()
  );
  if (existing) return existing;

  const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return createFolder(accessToken, parentId, `${name} - ${timestamp}`);
}

export async function uploadFile(accessToken, folderId, fileName, buffer, mimeType = "application/octet-stream") {
  const form = new FormData();
  form.append("content", new Blob([buffer], { type: mimeType }), fileName);
  const res = await fetch(
    `https://content.zoho.eu/workdrive/api/v1/upload?parent_id=${folderId}&override-name-exist=true`,
    {
      method: "POST",
      headers: { Authorization: "Zoho-oauthtoken " + accessToken },
      body: form,
    }
  );
  const data = await res.json();
  if (!data.data) throw new Error("Upload failed: " + JSON.stringify(data));
  return data.data;
}
