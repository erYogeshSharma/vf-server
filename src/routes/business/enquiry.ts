import express from 'express';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import { BadRequestError } from '../../core/ApiError';
import EnquiryRepo from '../../database/repository/EnquiryRepo';
import { SuccessResponse } from '../../core/ApiResponse';
import validator from '../../helpers/validator';
import schema from './schema';
import User from '../../database/model/User';

const router = express.Router();

//Create a new enquiry
router.get(
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = req.user as User;

    console.log({ bsId: user.business });
    if (!user.business) {
      throw new BadRequestError('User does not have a business');
    }

    const message = await EnquiryRepo.getEnquiriesForBusiness(user.business);

    new SuccessResponse('Enquiry created', message).send(res);
  }),
);

router.patch(
  '/status/:enquiryId',
  validator(schema.updateEnquiryStatus),

  asyncHandler(async (req: ProtectedRequest, res) => {
    if (!req.user.business) {
      throw new BadRequestError('User does not have a business');
    }
    const updatedEnquiry = await EnquiryRepo.changeEnquiryStatus(
      req.params.enquiryId,
      req.body.isSolved,
      req.user.business,
    );
    new SuccessResponse('Enquiry status updated', updatedEnquiry).send(res);
  }),
);

export default router;
