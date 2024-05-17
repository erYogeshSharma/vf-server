import express from 'express';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import { PublicRequest } from 'app-request';
import BusinessRepo from '../../database/repository/BusinessRepo';
import { BadRequestError } from '../../core/ApiError';
import EnquiryRepo from '../../database/repository/EnquiryRepo';
import Business from '../../database/model/Business';
import { SuccessResponse } from '../../core/ApiResponse';

const router = express.Router();

//Create a new enquiry
router.post(
  '/:businessId',
  validator(schema.addEnquiry),
  asyncHandler(async (req: PublicRequest, res) => {
    const business = await BusinessRepo.getBusinessByLinkId(
      req.params.businessId,
    );

    if (!business) {
      throw new BadRequestError('Business not found');
    }

    const message = await EnquiryRepo.create({
      business: business as Business,
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
      message: req.body.message,
    });

    new SuccessResponse('Enquiry created', message).send(res);
  }),
);

export default router;
