import { Router } from 'express';
import { getAllAlerts, createAlert } from '../controllers/alertsController.js';
import { validateRequiredFields } from '../middleware/validator.js';

const router = Router();

router.get('/', getAllAlerts);
router.post('/', validateRequiredFields(['category', 'severity', 'location', 'recommendedAction', 'summary']), createAlert);

export default router;
