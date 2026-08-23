// Shared CORS helper
function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Request-ID');
}
function ok(res, data, message = 'Success', status = 200) {
  res.status(status).json({ success: true, statusCode: status, message, data, timestamp: new Date().toISOString() });
}
function err(res, message, status = 500) {
  res.status(status).json({ success: false, statusCode: status, message, timestamp: new Date().toISOString() });
}

module.exports = function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  return ok(res, {
    service: 'NER-SmartRoute AI Node.js Backend API',
    status: 'ONLINE',
    environment: 'production',
    platform: 'Vercel Serverless',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  }, 'Service Health Operational');
};
