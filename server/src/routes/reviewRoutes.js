import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import validate from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { createReviewSchema, reviewQuerySchema } from '../validators/reviewValidators.js';

const router = express.Router();

router.get('/car/:carId', validate(reviewQuerySchema, 'query'), reviewController.listForCar);
router.post('/car/:carId', protect, validate(createReviewSchema), reviewController.upsert);
router.delete('/:id', protect, reviewController.remove);

export default router;