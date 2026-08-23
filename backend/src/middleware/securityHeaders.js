import crypto from 'crypto';

/**
 * SECURITY HEADERS & REQUEST ID MIDDLEWARE (Step 14)
 * Injects security headers and X-Request-ID traceability header.
 */
export function securityHeaders(req, res, next) {
  // Generate or forward unique request ID
  const requestId = req.headers['x-request-id'] || `req-${crypto.randomUUID()}`;
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);

  // Hardened Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
}
