import { successResponse } from '../utils/responseFormatter.js';

let suppliesData = [
  {
    id: 'SUP-DIST-01',
    district: 'Cachar (Silchar HQ)',
    state: 'Assam',
    population: 1736000,
    primaryHospital: 'Silchar Medical College & Hospital (SMCH)',
    isolationRisk: 'High',
    stockLevels: {
      medicalOxygen: { daysRemaining: 1.8, totalUnits: '4,200 Liters' },
      fuelPOL: { daysRemaining: 3.5, totalUnits: '85,000 Liters' },
      riceGrains: { daysRemaining: 12.0, totalUnits: '420 Metric Tonnes' },
      essentialMeds: { daysRemaining: 4.2, totalUnits: '1,800 Kits' }
    }
  }
];

export const getAllSupplies = async (req, res, next) => {
  try {
    return successResponse(res, suppliesData, 'Fetched district supply inventories & stock buffers');
  } catch (err) {
    next(err);
  }
};

export const logEmergencyRequisition = async (req, res, next) => {
  try {
    const { district, supplyCategory = 'Medical Oxygen', requestedUnits = '5,000 Liters' } = req.body;

    const requisition = {
      requisitionId: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      district,
      supplyCategory,
      requestedUnits,
      priority: 'CRITICAL',
      status: 'APPROVED & DISPATCHED',
      loggedAt: new Date().toISOString()
    };

    return successResponse(res, requisition, `Logged emergency supply requisition for ${district}`, 201);
  } catch (err) {
    next(err);
  }
};
