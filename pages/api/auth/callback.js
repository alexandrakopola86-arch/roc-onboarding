import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    const response = await axios.post('https://accounts.zoho.eu/oauth/v2/token', null, {
      params: {
        code,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        redirect_uri: 'https://roc-onboarding.vercel.app/api/auth/callback',
        grant_type: 'authorization_code',
      },
    });

    const { refresh_token, access_token } = response.data;

    console.log('=== ZOHO TOKENS ===');
    console.log('Refresh Token:', refresh_token);
    console.log('Access Token:', access_token);
    console.log('===================');

    return res.redirect('/auth/callback?success=true&refresh_token=' + refresh_token);
  } catch (error) {
    console.error('OAuth error:', error?.response?.data || error.message);
    return res.status(500).json({ error: 'OAuth failed', details: error?.response?.data });
  }
}
