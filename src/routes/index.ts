import express from 'express';

import auth from './auth/signup'
import login from './auth/login'
import token from './auth/token';

const router = express.Router();

router.use('/signup', auth);
router.use('/login', login);
router.use('/token', token);

export default router;
