import { Router } from 'express';
import { getAllDeliveries, createDelivery } from '../controllers/deliveriesController.js';
import { validateRequiredFields } from '../middleware/validator.js';

const router = Router();

router.get('/', getAllDeliveries);
router.post('/', validateRequiredFields(['vehicleId', 'cargoCategory', 'origin', 'destination']), createDelivery);

export default router;
