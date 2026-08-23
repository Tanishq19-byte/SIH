import { errorResponse } from '../utils/responseFormatter.js';
import { config } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  const requestId = req.requestId || 'unknown';
  console.error(`[Express Error Handler] reqId=${requestId} | ${req.method} ${req.url}:`, err.message);

  const statusCode = err.statusCode || 500;
  
  // In production, sanitize internal error messages
  const message = config.env === 'production' && statusCode === 500
    ? 'An internal server error occurred'
    : err.message || 'Internal Server Error';

  return errorResponse(res, message, { code: err.code || 'INTERNAL_ERROR', requestId }, statusCode);
};
