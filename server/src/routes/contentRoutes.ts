import { Router } from 'express';
import { createContent, getAllContent, getContent, updateContent, deleteContent, getRecentActivity, getDashboardStats, getActivityChartData } from '../controllers/contentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Stats & Activity
router.get('/stats', authenticate, getDashboardStats);
router.get('/stats/chart', authenticate, getActivityChartData);
router.get('/activity', authenticate, getRecentActivity);

// Posts
router.post('/posts', authenticate, authorize(['ADMIN', 'EDITOR', 'AUTHOR']), createContent('post'));
router.get('/posts', getAllContent('post'));
router.get('/posts/:id', getContent('post'));
router.put('/posts/:id', authenticate, authorize(['ADMIN', 'EDITOR']), updateContent('post'));
router.delete('/posts/:id', authenticate, authorize(['ADMIN']), deleteContent('post'));

// Projects
router.post('/projects', authenticate, authorize(['ADMIN', 'EDITOR', 'AUTHOR']), createContent('project'));
router.get('/projects', getAllContent('project'));
router.get('/projects/:id', getContent('project'));
router.put('/projects/:id', authenticate, authorize(['ADMIN', 'EDITOR']), updateContent('project'));
router.delete('/projects/:id', authenticate, authorize(['ADMIN']), deleteContent('project'));

// Stories
router.post('/stories', authenticate, authorize(['ADMIN', 'EDITOR', 'AUTHOR']), createContent('story'));
router.get('/stories', getAllContent('story'));
router.get('/stories/:id', getContent('story'));
router.put('/stories/:id', authenticate, authorize(['ADMIN', 'EDITOR']), updateContent('story'));
router.delete('/stories/:id', authenticate, authorize(['ADMIN']), deleteContent('story'));

export default router;
