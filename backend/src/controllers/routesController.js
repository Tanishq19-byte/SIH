import { successResponse, errorResponse } from '../utils/responseFormatter.js';

let routesData = [
  {
    id: 'R-NH27-SILCHAR',
    name: 'NH-27 Guwahati - Silchar Lifeline Corridor',
    states: ['Assam', 'Meghalaya'],
    distanceKm: 342,
    status: 'blocked',
    disruptionType: 'Sonapur Tunnel 340m Mudslide',
    accessibilityScore: 22.0,
    normalTravelHours: 7.5,
    currentTravelHours: 19.0,
    riskLevel: 'Critical'
  },
  {
    id: 'R-NH10-GANGTOK',
    name: 'NH-10 Siliguri - Gangtok Lifeline',
    states: ['West Bengal', 'Sikkim'],
    distanceKm: 114,
    status: 'warning',
    disruptionType: 'Teesta River Melli Submersion',
    accessibilityScore: 58.0,
    normalTravelHours: 3.5,
    currentTravelHours: 8.0,
    riskLevel: 'High'
  }
];

export const getAllRoutes = async (req, res, next) => {
  try {
    return successResponse(res, routesData, `Fetched ${routesData.length} highway corridors`);
  } catch (err) {
    next(err);
  }
};

export const getRouteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const route = routesData.find(r => r.id === id);

    if (!route) {
      return errorResponse(res, `Route '${id}' not found`, null, 404);
    }

    return successResponse(res, route, `Fetched route details for ${route.name}`);
  } catch (err) {
    next(err);
  }
};
