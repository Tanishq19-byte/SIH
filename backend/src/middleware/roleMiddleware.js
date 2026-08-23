import { errorResponse } from '../utils/responseFormatter.js';

/**
 * ROLE-BASED AUTHORIZATION CONTROL (Step 14)
 * Roles: admin, officer, analyst, field_inspector, viewer
 */
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required before role authorization check.', { code: 'UNAUTHORIZED' }, 401);
    }

    const userRole = (req.user.role || 'viewer').toLowerCase();
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

    if (!normalizedAllowed.includes(userRole)) {
      return errorResponse(
        res,
        `Access denied. Role '${req.user.role}' is not authorized to perform this operational action.`,
        { code: 'FORBIDDEN', requiredRoles: allowedRoles },
        403
      );
    }

    next();
  };
}
