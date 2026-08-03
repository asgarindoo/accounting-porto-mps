import express from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';

const router = express.Router();

router.post('/', analyticsController.trackEvent);
router.get('/stats', analyticsController.getStats);

export default router;
