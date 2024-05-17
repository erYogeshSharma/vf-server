import express from 'express';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import BusinessRepo from '../../database/repository/BusinessRepo';
import { BadRequestError } from '../../core/ApiError';
import EnquiryRepo from '../../database/repository/EnquiryRepo';
import { SuccessResponse } from '../../core/ApiResponse';
import authentication from '../../auth/authentication';

const router = express.Router();

router.use(authentication);

//Create a new enquiry
router.get(
  '/:businessId',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = req.user;

    const business = await BusinessRepo.getBusinessById(req.params.businessId);

    if (!business) {
      new BadRequestError('Business not found');
    }

    if (business?.user?.toString() !== user?._id?.toString()) {
      new BadRequestError('Unauthorized: user does not own this business');
    }

    const message = await EnquiryRepo.getEnquiriesForBusiness(
      req.params.businessId,
    );

    new SuccessResponse('Enquiry created', message).send(res);
  }),
);

export default router;
