import { Router } from 'express';
import { runSimulation, getSimulationHistory } from '../controllers/simulationsController.js';

const router = Router();

router.post('/run', runSimulation);
router.get('/history', getSimulationHistory);

export default router;
