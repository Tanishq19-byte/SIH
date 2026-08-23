import { successResponse } from '../utils/responseFormatter.js';

let simulationRuns = [];

export const runSimulation = async (req, res, next) => {
  try {
    const {
      rainfallMm = 180,
      numBlockages = 3,
      floodSeverity = 'High',
      landslideProb = 88,
      trafficCongestion = 'Dense'
    } = req.body;

    const blockedPct = Math.min(Math.round(numBlockages * 3.2 + (rainfallMm / 300) * 12), 45);
    const atRiskPct = Math.min(Math.round((landslideProb / 100) * 22 + (rainfallMm / 300) * 10), 38);
    const accessiblePct = Math.max(100 - blockedPct - atRiskPct, 17);

    const simulationResult = {
      id: `SIM-RUN-${Math.floor(1000 + Math.random() * 9000)}`,
      inputs: {
        rainfallMm,
        numBlockages,
        floodSeverity,
        landslideProb,
        trafficCongestion
      },
      baselineStats: { accessiblePct: 82, atRiskPct: 10, blockedPct: 8 },
      simulatedStats: { accessiblePct, atRiskPct, blockedPct },
      affectedVehiclesCount: numBlockages * 9,
      delayedDeliveriesCount: numBlockages * 14,
      preparedActions: [
        'Pre-position medicine stock in District Cachar (SMCH) & Kolasib HQ.',
        'Reroute priority essential supply vehicles before weather landfall.',
        'Alert Corridor R17 (NH-27 Sonapur) operators & pre-stage excavators.'
      ],
      executedAt: new Date().toISOString()
    };

    simulationRuns.unshift(simulationResult);
    return successResponse(res, simulationResult, 'Executed What-If Disaster Simulation Scenario');
  } catch (err) {
    next(err);
  }
};

export const getSimulationHistory = async (req, res, next) => {
  try {
    return successResponse(res, simulationRuns, `Fetched ${simulationRuns.length} past simulation runs`);
  } catch (err) {
    next(err);
  }
};
