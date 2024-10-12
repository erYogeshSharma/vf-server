import express from 'express';
import adminRoutes from './admin';
import authentication from '../../auth/authentication';

const router = express.Router();
router.use(authentication);
router.use(adminRoutes);

export default router;
