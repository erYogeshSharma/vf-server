import express from 'express';

import auth from './auth-routes';
import forgotPassword from './password-routes';

const router = express.Router();

router.use('/password', forgotPassword);
router.use('/', auth);

export default router;
