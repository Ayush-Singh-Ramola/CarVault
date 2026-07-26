import express from 'express';
import * as brandController from '../controllers/brandController.js';

const router = express.Router();

router.get('/', brandController.list);

export default router;