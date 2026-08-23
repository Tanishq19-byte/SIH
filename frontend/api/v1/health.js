export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  return res.json({
    success: true, statusCode: 200,
    message: 'Service Health Operational',
    data: {
      service: 'NER-SmartRoute AI Backend API',
      status: 'ONLINE',
      environment: 'production',
      platform: 'Vercel Serverless',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  });
}
