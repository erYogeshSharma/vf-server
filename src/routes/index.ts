import express from 'express';

import auth from './auth/signup';
import login from './auth/login';
import token from './auth/token';
import logout from './auth/logout';
import business from './business';
import media from './media';
import client from './client';
import createEnquiry from './enquiry/create';
import getEnquiries from './enquiry/getEnquiry';
import forgotPassword from './auth/forgot-password';
import updatePassword from './auth/change-password';
import updateInfo from './auth/update-info';

import userRoutes from './user/index';

const router = express.Router();

router.use('/signup', auth);
router.use('/login', login);
router.use('/logout', logout);
router.use('/token', token);
router.use('/forgot-password', forgotPassword);
router.use('/change-password', updatePassword);
router.use('/update-info', updateInfo);

router.use('/user', userRoutes);
router.use('/business', business);
router.use('/client', client);
router.use('/media', media);

router.use('/enquiry/create', createEnquiry);
router.use('/enquiry/get', getEnquiries);

export default router;
