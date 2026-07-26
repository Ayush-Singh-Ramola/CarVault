import express from 'express';
import * as favoriteController from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', favoriteController.list);
router.post('/:carId', favoriteController.add);
router.delete('/:carId', favoriteController.remove);

export default router;