import { successResponse, errorResponse } from '../utils/responseFormatter.js';

let deliveriesData = [
  {
    id: 'DEL-OXY-8891',
    vehicleId: 'V-NER-8891',
    cargoCategory: 'Medicines',
    cargoDescription: '22,000L Cryogenic Medical Oxygen',
    cargoQuantity: '22,000 Liters',
    origin: 'Guwahati Oxygen Hub',
    destination: 'Silchar SMCH Hospital',
    priorityLevel: 'Critical',
    etaOriginal: '2026-08-23T14:00:00Z',
    etaRevised: '2026-08-24T01:30:00Z',
    delayHours: 11.5,
    status: 'in_transit'
  },
  {
    id: 'DEL-VAC-3091',
    vehicleId: 'V-NER-3091',
    cargoCategory: 'Medicines',
    cargoDescription: '1,850 Cold Chain Vaccine Kits',
    cargoQuantity: '1,850 Kits',
    origin: 'Siliguri Depot',
    destination: 'STNM Hospital Gangtok',
    priorityLevel: 'Critical',
    etaOriginal: '2026-08-23T16:00:00Z',
    etaRevised: '2026-08-23T20:30:00Z',
    delayHours: 4.5,
    status: 'in_transit'
  }
];

export const getAllDeliveries = async (req, res, next) => {
  try {
    return successResponse(res, deliveriesData, `Fetched ${deliveriesData.length} essential supply deliveries`);
  } catch (err) {
    next(err);
  }
};

export const createDelivery = async (req, res, next) => {
  try {
    const { vehicleId, cargoCategory, cargoDescription, cargoQuantity, origin, destination, priorityLevel } = req.body;

    const newDelivery = {
      id: `DEL-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleId,
      cargoCategory,
      cargoDescription,
      cargoQuantity,
      origin,
      destination,
      priorityLevel: priorityLevel || 'High',
      etaOriginal: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      etaRevised: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      delayHours: 0,
      status: 'in_transit',
      createdAt: new Date().toISOString()
    };

    deliveriesData.unshift(newDelivery);
    return successResponse(res, newDelivery, `Created delivery manifest ${newDelivery.id}`, 201);
  } catch (err) {
    next(err);
  }
};
