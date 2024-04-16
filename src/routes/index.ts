import express from 'express';

import auth from './auth/signup';
import login from './auth/login';
import token from './auth/token';
import business from './business';

const router = express.Router();

router.use('/signup', auth);
router.use('/login', login);
router.use('/token', token);
router.use('/business', business);

export default router;
