import { Router } from 'express';
import vehiclesRoutes from './vehiclesRoutes.js';
import deliveriesRoutes from './deliveriesRoutes.js';
import incidentsRoutes from './incidentsRoutes.js';
import routesRoutes from './routesRoutes.js';
import predictionsRoutes from './predictionsRoutes.js';
import alertsRoutes from './alertsRoutes.js';
import suppliesRoutes from './suppliesRoutes.js';
import simulationsRoutes from './simulationsRoutes.js';
import aiRoutes from './aiRoutes.js';

const router = Router();

// Master API v1 Router Registration
router.use('/vehicles', vehiclesRoutes);
router.use('/deliveries', deliveriesRoutes);
router.use('/incidents', incidentsRoutes);
router.use('/routes', routesRoutes);
router.use('/predictions', predictionsRoutes);
router.use('/alerts', alertsRoutes);
router.use('/supplies', suppliesRoutes);
router.use('/simulations', simulationsRoutes);
router.use('/ai', aiRoutes);

export default router;
