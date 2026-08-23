import { Router } from 'express';
import { predictDisruptionProxy, getAIHealthProxy, getScenariosProxy } from '../controllers/aiController.js';

const router = Router();

router.get('/health', getAIHealthProxy);
router.get('/scenarios', getScenariosProxy);
router.post('/predict-disruption', predictDisruptionProxy);

export default router;
