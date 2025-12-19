import { Router } from 'express';
import { register, login, getMe, getAllUsers, updateUserRole, deleteUser } from '../controllers/authController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);

// User Management
router.get('/', authenticate, authorize(['ADMIN']), getAllUsers);
router.put('/:id/role', authenticate, authorize(['ADMIN']), updateUserRole);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteUser);

export default router;
