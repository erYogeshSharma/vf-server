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
import LinkRepo from '../../database/repository/LinkRepo';
import Business from '../../database/model/Business';

const router = express.Router();
router.use(authentication);

router.post(
  '/create',
  validator(schema.businessCreate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const urlExists = await BusinessRepo.findUrlIfExists(req.body.linkId);
    if (urlExists)
      throw new BadRequestError('Business Already Exists with the ID');
    const createdBusiness = await BusinessRepo.create({
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
      user: req.user,
    } as Business);
    return new SuccessResponse('success', createdBusiness).send(res);
  }),
);
router.patch(
  '/update',
  validator(schema.businessCreate),
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

router.get(
  '/all',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const business = await BusinessRepo.getAllUserBusiness(
      req.user._id.toString(),
    );
    return new SuccessResponse('success', business).send(res);
  }),
);

router.get(
  '/details/:id',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const business = await BusinessRepo.getBusinessById(req.params.id);
    if (!business) {
      return new FailureMsgResponse('Business not found').send(res);
    }
    return new SuccessResponse('success', business).send(res);
  }),
);

router.post(
  '/id-availability',
  validator(schema.checkLinkAvailable),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const exists = await BusinessRepo.findUrlIfExists(
      req.body.linkId as string,
    );
    console.log(exists);
    if (!exists) {
      return new FailureMsgResponse(`Link : ${req.body.linkId} not available`);
    }

    return new SuccessMsgResponse(`Link: ${req.body.linkId} is available`).send(
      res,
    );
  }),
);

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

router.post(
  '/link',
  validator(schema.addLinkIcon),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdLink = await LinkRepo.create({
      title: req.body.title,
      category: req.body.category,
      isActive: true,
      icon: req.body.icon,
      createdBy: req.user,
    });
    return new SuccessResponse('success', createdLink).send(res);
  }),
);

router.post(
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

router.get(
  '/links',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const links = await LinkRepo.find(req.user._id);
    return new SuccessResponse('success', links).send(res);
  }),
);

export default router;
