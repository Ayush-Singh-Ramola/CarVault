import express from 'express';
import * as carController from '../controllers/carController.js';
import validate from '../middleware/validate.js';
import { protect, restrictTo, attachUserIfPresent } from '../middleware/auth.js';
import { uploadCarImages } from '../middleware/upload.js';
import { carQuerySchema, createCarSchema, updateCarSchema } from '../validators/carValidators.js';

const router = express.Router();

router.get('/', validate(carQuerySchema, 'query'), attachUserIfPresent, carController.list);
router.get('/:slug', attachUserIfPresent, carController.getBySlug);

router.post(
  '/',
  protect,
  restrictTo('ADMIN'),
  uploadCarImages,
  validate(createCarSchema),
  carController.create
);

router.patch(
  '/:id',
  protect,
  restrictTo('ADMIN'),
  uploadCarImages,
  validate(updateCarSchema),
  carController.update
);

router.delete('/:id', protect, restrictTo('ADMIN'), carController.remove);
router.delete('/:id/images/:imageId', protect, restrictTo('ADMIN'), carController.deleteImage);

export default router;