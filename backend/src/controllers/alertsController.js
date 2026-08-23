import { successResponse, errorResponse } from '../utils/responseFormatter.js';

let alertsData = [
  {
    id: 'ALT-2026-001',
    category: 'Road blocked',
    severity: 'Critical',
    timeDisplay: '4 mins ago',
    location: 'Sonapur Tunnel South Portal (NH-27 KM 142.5), Meghalaya',
    affectedVehicle: 'AS-01-GC-9921 (Cryogenic Oxygen Tanker 22,000L)',
    affectedDeliveryId: 'DEL-OXY-8891',
    recommendedAction: 'Reroute vehicle AS-01-GC-9921 via Lumding-Haflong Corridor B immediately.',
    isRead: false,
    summary: '340m debris fall completely blocked both lanes of NH-27.'
  }
];

export const getAllAlerts = async (req, res, next) => {
  try {
    return successResponse(res, alertsData, `Fetched ${alertsData.length} command alerts`);
  } catch (err) {
    next(err);
  }
};

export const createAlert = async (req, res, next) => {
  try {
    const { category, severity, location, recommendedAction, summary } = req.body;

    const newAlert = {
      id: `ALT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      severity,
      timeDisplay: 'Just now',
      timestamp: new Date().toISOString(),
      location,
      affectedVehicle: req.body.affectedVehicle || 'Unspecified Convoy',
      affectedDeliveryId: req.body.affectedDeliveryId || null,
      recommendedAction,
      isRead: false,
      summary,
      createdAt: new Date().toISOString()
    };

    alertsData.unshift(newAlert);
    return successResponse(res, newAlert, `Created alert ${newAlert.id}`, 201);
  } catch (err) {
    next(err);
  }
};
