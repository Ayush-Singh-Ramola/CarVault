import express from 'express';
import authRoutes from './authRoutes.js';
import carRoutes from './carRoutes.js';
import brandRoutes from './brandRoutes.js';
import favoriteRoutes from './favoriteRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cars', carRoutes);
router.use('/brands', brandRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/reviews', reviewRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;