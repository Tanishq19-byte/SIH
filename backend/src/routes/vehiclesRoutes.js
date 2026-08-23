import { Router } from 'express';
import { getAllVehicles, getVehicleById, createVehicle, rerouteVehicle } from '../controllers/vehiclesController.js';
import { validateRequiredFields } from '../middleware/validator.js';

const router = Router();

router.get('/', getAllVehicles);
router.get('/:id', getVehicleById);
router.post('/', validateRequiredFields(['regNumber', 'driverName', 'agency', 'cargoCategory']), createVehicle);
router.post('/:id/reroute', rerouteVehicle);

export default router;
