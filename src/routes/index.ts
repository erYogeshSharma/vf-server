import express from 'express';
import authRoutes from './auth';
import business from './business';
import media from './media';

import userRoutes from './user/index';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/business', business);

router.use('/media', media);

export default router;
