import express from 'express';
import * as portfolioController from '../controllers/portfolio.controller.js';

const router = express.Router();

router.get('/', portfolioController.getPortfolioData);

export default router;
