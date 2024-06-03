import express from 'express';
const router = express.Router();

import client from './client';
router.use('/client', client);

import authentication from '../../auth/authentication';
router.use(authentication);

import businessRoute from './business-routes';
router.use('/', businessRoute);

import linkOptionsRoute from './linkOptions';
router.use('/links', linkOptionsRoute);

import enquiryRoute from './enquiry';
router.use('/enquiry', enquiryRoute);

import visitsRout from './visits';
router.use('/visits', visitsRout);

import offerRoutes from './offer';
router.use('/offer', offerRoutes);

export default router;
