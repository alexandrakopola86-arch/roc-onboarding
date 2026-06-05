export default async function handler(req, res) {
  const code = req.query.code;
  
  if (!code) {
    return res.status(400).json({ error: 'No code provided', query: req.query });
  }

  try {
    const params = new URLSearchParams({
      code,
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      redirect_uri: 'https://roc-onboarding.vercel.app/api/auth/callback',
      grant_type: 'authorization_code',
    });

    const response = await fetch('https://accounts.zoho.eu/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();
    console.log('ZOHO RESPONSE:', JSON.stringify(data));

    if (data.refresh_token) {
      return r
cat > pages/api/auth/callback.js << 'EOF'
export default async function handler(req, res) {
  const code = req.query.code;
  
  if (!code) {
    return res.status(400).json({ error: 'No code provided', query: req.query });
  }

  try {
    const params = new URLSearchParams({
      code,
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      redirect_uri: 'https://roc-onboarding.vercel.app/api/auth/callback',
      grant_type: 'authorization_code',
    });

    const response = await fetch('https://accounts.zoho.eu/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();
    console.log('ZOHO RESPONSE:', JSON.stringify(data));

    if (data.refresh_token) {
      return r
cat > pages/api/auth/callback.js << 'EOF'
export default async function handler(req, res) {
  const code = req.query.code;
  
  if (!code) {
    return res.status(400).json({ error: 'No code provided', query: req.query });
  }

  try {
    const params = new URLSearchParams({
      code,
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      redirect_uri: 'https://roc-onboarding.vercel.app/api/auth/callback',
      grant_type: 'authorization_code',
    });

    const response = await fetch('https://accounts.zoho.eu/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();
    console.log('ZOHO RESPONSE:', JSON.stringify(data));

    if (data.refresh_token) {
      return res.status(200).send(
        '<h2>Επιτυχια!</h2><p><strong>Refresh Token:</strong></p><textarea rows="3" style="width:100%">' + data.refresh_token + '</textarea>'
      );
    } else {
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
