import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import authentication from '../../auth/authentication';
import { ProtectedRequest } from 'app-request';
import BusinessRepo from '../../database/repository/BusinessRepo';
import { BadRequestError } from '../../core/ApiError';
import schema from './schema';
import validator from '../../helpers/validator';

const router = express.Router();
router.use(authentication);

router.post(
  '/create',
  validator(schema.businessCreate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const urlExists = await BusinessRepo.findUrlIfExists(req.body.linkId);
    if (urlExists)
      throw new BadRequestError('Business Already Exists with the ID');
    const createdBusines = await BusinessRepo.create({
      linkId: req.body.linkId,
      name: req.body.name,
      title: req.body.title,
      description: req.body.description,
      email: req.body.email,
      phone: req.body.phone,
      logo: req.body.logo,
      coverImage: req.body.coverImage,
    });
    const data = req.body;
    const user = req.user;

    return new SuccessResponse('success', { user: user, payload: data }).send(
      res,
    );
  }),
);

export default router;
