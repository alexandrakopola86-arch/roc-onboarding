const axios = require('axios');

const ZOHO_BASE = 'https://www.zohoapis.eu';
const ZOHO_ACCOUNTS = 'https://accounts.zoho.eu';

async function getAccessToken() {
  const res = await axios.post(`${ZOHO_ACCOUNTS}/oauth/v2/token`, null, {
    params: {
      refresh_token: process.env.ZOHO_REFRESH_TOKEN,
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      grant_type: 'refresh_token',
    },
  });
  return res.data.access_token;
}

async function createFolder(accessToken, parentId, folderName) {
  const res = await axios.post(
    `${ZOHO_BASE}/workdrive/api/v1/files`,
    {
      data: {
        attributes: {
          name: folderName,
          parent_id: parentId,
          is_folder: true,
        },
      },
    },
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data.data.id;
}

async function createSheet(accessToken, parentId, fileName, formData) {
  // Create a CSV content from form data
  const headers = [
    'Τύπος Οντότητας', 'Όνομα', 'Επώνυμο', 'Email', 'Τηλέφωνο',
    'Οργανισμός', 'Περιοχή', 'Έκταση (ha)', 'Αριθμός Τεμαχίων',
    'Καλλιέργειες', 'Εξοπλισμός', 'Γεωπόνος', 'Πηγή', 'Σχόλια', 'Ημερομηνία'
  ];

  const values = [
    formData.type || '',
    formData.firstName || '',
    formData.lastName || '',
    formData.email || '',
    formData.phone || '',
    formData.orgName || '',
    formData.region || '',
    formData.hectares || '',
    formData.plots || '',
    (formData.crops || []).join(' | '),
    (formData.equipment || []).join(' | '),
    formData.agronomist || '',
    formData.source || '',
    formData.comments || '',
    new Date().toLocaleDateString('el-GR'),
  ];

  const csvContent = [
    headers.join(','),
    values.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
  ].join('\n');

  const blob = Buffer.from('\uFEFF' + csvContent, 'utf-8');

  const FormData = require('form-data');
  const form = new FormData();
  form.append('content', blob, {
    filename: `${fileName}.csv`,
    contentType: 'text/csv',
  });
  form.append('parent_id', parentId);
  form.append('override-name-exist', 'true');

  const res = await axios.post(
    `${ZOHO_BASE}/workdrive/api/v1/upload`,
    form,
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        ...form.getHeaders(),
      },
    }
  );
  return res.data;
}

module.exports = { getAccessToken, createFolder, createSheet };
