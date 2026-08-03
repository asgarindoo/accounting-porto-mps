import express from 'express';
import * as settingsController from '../controllers/settings.controller.js';

const router = express.Router();

router
  .route('/')
  .get(settingsController.getSettings)
  .put(settingsController.updateSettings);

export default router;
