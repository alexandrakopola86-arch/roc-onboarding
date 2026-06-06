export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  console.log('Equipment submission:', JSON.stringify(req.body));
  return res.status(200).json({ success: true });
}
