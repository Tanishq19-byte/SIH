import { Router } from 'express';
import { getAllPredictions, evaluateCorridor } from '../controllers/predictionsController.js';

const router = Router();

router.get('/', getAllPredictions);
router.post('/evaluate', evaluateCorridor);

export default router;
