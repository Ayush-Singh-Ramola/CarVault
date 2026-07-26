import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, restrictTo('ADMIN'));

router.get('/overview', dashboardController.getOverview);

export default router;