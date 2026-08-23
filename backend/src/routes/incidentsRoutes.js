import { Router } from 'express';
import { getAllIncidents, createIncident, updateIncidentStatus } from '../controllers/incidentsController.js';
import { validateRequiredFields } from '../middleware/validator.js';

const router = Router();

router.get('/', getAllIncidents);
router.post('/', validateRequiredFields(['title', 'category', 'severity', 'state', 'locationDescription']), createIncident);
router.patch('/:id/status', validateRequiredFields(['status']), updateIncidentStatus);

export default router;
