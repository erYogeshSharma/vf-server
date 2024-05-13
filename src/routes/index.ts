import express from 'express';

import auth from './auth/signup';
import login from './auth/login';
import token from './auth/token';
import logout from './auth/logout';
import business from './business';
import media from './media';

const router = express.Router();

router.use('/signup', auth);
router.use('/login', login);
router.use('/logout', logout);
router.use('/token', token);
router.use('/business', business);
router.use('/media', media);

export default router;
