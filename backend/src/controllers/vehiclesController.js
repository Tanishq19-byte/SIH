import { successResponse, errorResponse } from '../utils/responseFormatter.js';

// Sample in-memory dataset store (Mirroring Supabase query layer)
let vehiclesData = [
  {
    id: 'V-NER-8891',
    regNumber: 'AS-01-GC-9921',
    driverName: 'Biren Gogoi',
    driverPhone: '+91 98640 11234',
    agency: 'Assam State Oxygen Mission / IOCL',
    cargoCategory: 'Medicines',
    cargoDescription: 'Cryogenic Liquid Medical Oxygen (22,000 Liters)',
    origin: 'Guwahati Oxygen Hub',
    destination: 'Silchar Medical College & Hospital',
    status: 'route_interrupted',
    speedKmh: 0,
    fuelLevelPct: 62,
    delayHours: 11.5
  },
  {
    id: 'V-NER-4412',
    regNumber: 'ML-05-E-4412',
    driverName: 'Sangma Marak',
    driverPhone: '+91 94361 88219',
    agency: 'Food Corporation of India (FCI)',
    cargoCategory: 'Food',
    cargoDescription: 'Fortified Rice & Wheat Manifest',
    origin: 'FCI Depot Changsari, Assam',
    destination: 'Shillong Central Civil Supplies Warehouse',
    status: 'on_duty',
    speedKmh: 48,
    fuelLevelPct: 84,
    delayHours: 0.75
  }
];

export const getAllVehicles = async (req, res, next) => {
  try {
    const { status, category } = req.query;
    let result = [...vehiclesData];

    if (status) {
      result = result.filter(v => v.status === status);
    }
    if (category) {
      result = result.filter(v => v.cargoCategory === category);
    }

    return successResponse(res, result, `Fetched ${result.length} logistics vehicles`);
  } catch (err) {
    next(err);
  }
};

export const getVehicleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = vehiclesData.find(v => v.id === id || v.regNumber === id);

    if (!vehicle) {
      return errorResponse(res, `Vehicle with ID '${id}' not found`, null, 404);
    }

    return successResponse(res, vehicle, `Fetched vehicle ${vehicle.regNumber}`);
  } catch (err) {
    next(err);
  }
};

export const createVehicle = async (req, res, next) => {
  try {
    const { regNumber, driverName, agency, cargoCategory, cargoDescription, origin, destination } = req.body;

    const newVehicle = {
      id: `V-NER-${Math.floor(1000 + Math.random() * 9000)}`,
      regNumber,
      driverName,
      driverPhone: req.body.driverPhone || '+91 98000 00000',
      agency,
      cargoCategory,
      cargoDescription,
      origin,
      destination,
      status: 'on_duty',
      speedKmh: 45,
      fuelLevelPct: 100,
      delayHours: 0,
      createdAt: new Date().toISOString()
    };

    vehiclesData.unshift(newVehicle);
    return successResponse(res, newVehicle, `Created vehicle registration ${regNumber}`, 201);
  } catch (err) {
    next(err);
  }
};

export const rerouteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = vehiclesData.find(v => v.id === id);

    if (!vehicle) {
      return errorResponse(res, `Vehicle '${id}' not found`, null, 404);
    }

    vehicle.status = 'rerouted';
    vehicle.delayHours = Math.max(vehicle.delayHours - 8.5, 0.5);
    vehicle.speedKmh = 42;

    return successResponse(res, vehicle, `Rerouted vehicle ${vehicle.regNumber} via AI bypass corridor`);
  } catch (err) {
    next(err);
  }
};
