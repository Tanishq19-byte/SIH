import { Router } from 'express';
import { getAllSupplies, logEmergencyRequisition } from '../controllers/suppliesController.js';
import { validateRequiredFields } from '../middleware/validator.js';

const router = Router();

router.get('/', getAllSupplies);
router.post('/requisition', validateRequiredFields(['district']), logEmergencyRequisition);

export default router;
