import { errorResponse } from '../utils/responseFormatter.js';

export const validateRequiredFields = (requiredFields = []) => {
  return (req, res, next) => {
    const missing = [];

    for (const field of requiredFields) {
      if (!req.body || req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return errorResponse(
        res,
        `Validation Failed: Missing required payload fields: [${missing.join(', ')}]`,
        { missingFields: missing },
        400
      );
    }

    next();
  };
};
