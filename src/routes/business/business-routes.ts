import express from 'express';
import {
  FailureMsgResponse,
  SuccessMsgResponse,
  SuccessResponse,
} from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import authentication from '../../auth/authentication';
import { ProtectedRequest } from 'app-request';
import BusinessRepo from '../../database/repository/BusinessRepo';
import { BadRequestError } from '../../core/ApiError';
import schema from './schema';
import validator from '../../helpers/validator';
import Business from '../../database/model/Business';
import { checkBusinessExists } from './middleware';
import { Types } from 'mongoose';

const router = express.Router();

router.use(authentication);
/* -------------------------------------------------------------------------- */
/*                         GET BUSINESS ID AVAILABILITY                        */
/* -------------------------------------------------------------------------- */
router.post(
  '/id-availability',
  validator(schema.checkLinkAvailable),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const exists = await BusinessRepo.findUrlIfExists(
      req.body.linkId as string,
    );

    if (exists) {
      throw new FailureMsgResponse(`Link : ${req.body.linkId} not available`);
    }

    return new SuccessMsgResponse(`Link: ${req.body.linkId} is available`).send(
      res,
    );
  }),
);

/* -------------------------------------------------------------------------- */
/*                              CREATE A BUSINESS                             */
/* -------------------------------------------------------------------------- */
router.post(
  '/create',
  validator(schema.businessCreate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    try {
      const urlExists = await BusinessRepo.findUrlIfExists(req.body.linkId);
      if (urlExists)
        throw new BadRequestError('Business Already Exists with the ID');

      if (req.user.business) {
        throw new BadRequestError('User already has a business');
      }

      const createdBusiness = await BusinessRepo.create({
        linkId: req.body.linkId,
        logo: req.body.logo,
        name: req.body.name,
        category: req.body.category,
        user: req.user._id,
      });
      return new SuccessResponse('success', createdBusiness).send(res);
    } catch (error) {
      throw new BadRequestError(error as string);
    }
  }),
);
/* -------------------------------------------------------------------------- */
/*                                GET ALL BUSINESS                               */
/* -------------------------------------------------------------------------- */
router.get(
  '/all',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const business = await BusinessRepo.getAllUserBusiness(req.user._id);
    return new SuccessResponse('success', business).send(res);
  }),
);

/* -------------------------------------------------------------------------- */
/*                            GET BUSINESS DETAILS                            */
/* -------------------------------------------------------------------------- */
router.get(
  '/details',
  checkBusinessExists,
  asyncHandler(async (req: ProtectedRequest, res) => {
    const business = await BusinessRepo.getBusinessById(
      req.user.business as Types.ObjectId,
    );

    if (!business) {
      return new FailureMsgResponse('Business not found').send(res);
    }
    return new SuccessResponse('success', business).send(res);
  }),
);

/* -------------------------------------------------------------------------- */
/*                        UPDATE BUSINESS BASIC DETAILS                       */
/* -------------------------------------------------------------------------- */
router.patch(
  '/update',
  validator(schema.basicDetailsUpdate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdBusiness = await BusinessRepo.update(req.user._id.toString(), {
      linkId: req.body.linkId,
      logo: req.body.logo,
      coverImage: req.body.coverImage,
      name: req.body.name,
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      email: req.body.email,
      phone: req.body.phone,
      alternatePhone: req.body.alternatePhone,
      _id: req.body._id,
    } as Business);

    return new SuccessResponse('success', createdBusiness).send(res);
  }),
);

/* -------------------------------------------------------------------------- */
/*                               UPDATE ADDRESS                               */
/* -------------------------------------------------------------------------- */
router.patch(
  '/update-address',
  validator(schema.updateAddress),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedBusiness = await BusinessRepo.updateAddress(
      req.user._id.toString(),
      req.body,
    );
    return new SuccessResponse('success', updatedBusiness).send(res);
  }),
);

/* -------------------------------------------------------------------------- */
/*                               UPDATE CALENDER                              */
/* -------------------------------------------------------------------------- */
router.patch(
  '/update-calender',
  validator(schema.updateCalender),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedBusiness = await BusinessRepo.updateCalender(
      req.user._id.toString(),
      req.body,
    );
    return new SuccessResponse('success', updatedBusiness).send(res);
  }),
);

/* -------------------------------------------------------------------------- */
/*                               UPDATE GALLERY                               */
/* -------------------------------------------------------------------------- */
router.patch(
  '/update-gallery',
  validator(schema.updateGallery),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedBusiness = await BusinessRepo.updateGallery(
      req.user._id.toString(),
      req.body,
    );
    return new SuccessResponse('success', updatedBusiness).send(res);
  }),
);
/* -------------------------------------------------------------------------- */
/*                               UPDATE PRODUCTS                              */
/* -------------------------------------------------------------------------- */
router.patch(
  '/update-products',
  validator(schema.updateProducts),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedBusiness = await BusinessRepo.updateProducts(
      req.user._id.toString(),
      req.body,
    );
    return new SuccessResponse('success', updatedBusiness).send(res);
  }),
);

/* -------------------------------------------------------------------------- */
/*                                UPDATE LINKS                                */
/* -------------------------------------------------------------------------- */
router.patch(
  '/update-links',
  validator(schema.updateLinks),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedBusiness = await BusinessRepo.updateLinks(
      req.user._id.toString(),
      req.body,
    );
    return new SuccessResponse('success', updatedBusiness).send(res);
  }),
);

/* -------------------------------------------------------------------------- */
/*                          UPDATE BUSINESS SETTINGS                          */
/* -------------------------------------------------------------------------- */
router.patch(
  '/update-settings',
  validator(schema.updateSettings),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedBusiness = await BusinessRepo.updateSettings(
      req.user._id.toString(),
      req.body,
    );
    return new SuccessResponse('success', updatedBusiness).send(res);
  }),
);

export default router;
