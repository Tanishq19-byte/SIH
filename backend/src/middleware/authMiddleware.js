import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { errorResponse } from '../utils/responseFormatter.js';

/**
 * JWT AUTHENTICATION MIDDLEWARE (Step 14)
 * Verifies Bearer token or x-auth-token header and attaches decoded user context.
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];

  if (!authHeader) {
    // If request has no auth token, check if route allows anonymous access or return 401
    return errorResponse(res, 'Authentication required. Missing authorization token.', { code: 'UNAUTHORIZED' }, 401);
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Authentication token has expired. Please log in again.', { code: 'TOKEN_EXPIRED' }, 401);
    }
    return errorResponse(res, 'Invalid authentication token.', { code: 'INVALID_TOKEN' }, 401);
  }
}

/**
 * Optional Authentication Helper (Attaches req.user if token is valid, proceeds if omitted)
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];

  if (!authHeader) {
    req.user = { id: 'anon', role: 'viewer', agency: 'Public' };
    return next();
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
  } catch (err) {
    req.user = { id: 'anon', role: 'viewer', agency: 'Public' };
  }

  next();
}
