import { Router } from 'express';
import { upload, uploadMedia, getAllMedia, deleteMedia, getMediaUsage } from '../controllers/mediaController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/upload', authenticate, upload.single('file'), uploadMedia);
router.get('/', getAllMedia);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteMedia);
router.get('/:id/usage', authenticate, getMediaUsage);

export default router;
