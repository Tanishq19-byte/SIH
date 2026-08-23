import { successResponse, errorResponse } from '../utils/responseFormatter.js';

let incidentsData = [
  {
    id: 'INC-2026-001',
    title: 'Sonapur Tunnel Portal Debris Fall',
    category: 'Landslide',
    severity: 'Critical',
    corridorId: 'R-NH27-SILCHAR',
    state: 'Meghalaya',
    district: 'East Jaintia Hills',
    locationDescription: 'NH-27 KM 142.5 near Sonapur Tunnel South Portal',
    reportedBy: 'Inspector R. Terang',
    reporterAgency: 'BRO 44 BRTF / NHIDCL Patrol',
    reportedTime: '2026-08-23T08:15:00Z',
    status: 'Verified',
    impactSummary: '340m debris fall completely blocked both lanes of NH-27. 38 essential freight trucks stranded.',
    aiRiskIndex: 94.5
  }
];

export const getAllIncidents = async (req, res, next) => {
  try {
    const { status, category, severity } = req.query;
    let result = [...incidentsData];

    if (status) result = result.filter(i => i.status === status);
    if (category) result = result.filter(i => i.category === category);
    if (severity) result = result.filter(i => i.severity === severity);

    return successResponse(res, result, `Fetched ${result.length} field incidents`);
  } catch (err) {
    next(err);
  }
};

export const createIncident = async (req, res, next) => {
  try {
    const { title, category, severity, state, district, locationDescription, reportedBy, reporterAgency } = req.body;

    const newIncident = {
      id: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      category,
      severity,
      state,
      district,
      locationDescription,
      reportedBy: reportedBy || 'Field Officer App',
      reporterAgency: reporterAgency || 'Ground Inspection Team',
      reportedTime: new Date().toISOString(),
      status: 'Reported',
      photoUrl: req.body.photoUrl || null,
      impactSummary: req.body.impactSummary || 'Submitted ground incident report.',
      aiRiskIndex: severity === 'Critical' ? 92.0 : 65.0,
      createdAt: new Date().toISOString()
    };

    incidentsData.unshift(newIncident);
    return successResponse(res, newIncident, `Ground report #${newIncident.id} received successfully`, 201);
  } catch (err) {
    next(err);
  }
};

export const updateIncidentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const incident = incidentsData.find(i => i.id === id);
    if (!incident) {
      return errorResponse(res, `Incident '${id}' not found`, null, 404);
    }

    incident.status = status;
    return successResponse(res, incident, `Updated incident #${id} status to '${status}'`);
  } catch (err) {
    next(err);
  }
};
