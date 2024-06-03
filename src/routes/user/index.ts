import express from 'express';
import authentication from '../../auth/authentication';

import userRoutes from './user-routes';
const router = express.Router();

router.use(authentication);

router.use('/', userRoutes);

export default router;
