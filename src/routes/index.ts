import express from 'express';
import authRoutes from './auth';
import business from './business';
import media from './media';
import admin from './admin';
import userRoutes from './user/index';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/business', business);

router.use('/media', media);
router.use('/admin', admin);

export default router;
