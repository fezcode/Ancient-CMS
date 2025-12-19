import { Router } from 'express';
import { getSystemHealth } from '../controllers/systemController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/health', authenticate, getSystemHealth);

export default router;
