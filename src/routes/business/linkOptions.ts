import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import schema from './schema';
import validator from '../../helpers/validator';
import LinkRepo from '../../database/repository/LinkRepo';

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                                GET ALL LINKS                               */
/* -------------------------------------------------------------------------- */
router.get(
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const links = await LinkRepo.find(req.user._id);
    return new SuccessResponse('success', links).send(res);
  }),
);
/* -------------------------------------------------------------------------- */
/*                             CREATE A LINK OPTION                            */
/* -------------------------------------------------------------------------- */
router.post(
  '/',
  validator(schema.addLinkIcon),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdLink = await LinkRepo.create({
      title: req.body.title,
      category: req.body.category,
      isActive: true,
      icon: req.body.icon,
      createdBy: req.user._id,
    });
    return new SuccessResponse('success', createdLink).send(res);
  }),
);

export default router;
