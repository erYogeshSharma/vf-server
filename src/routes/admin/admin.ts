import { ProtectedRequest } from 'app-request';
import express from 'express';
import authentication from '../../auth/authentication';
import asyncHandler from '../../helpers/asyncHandler';
import UserRepo from '../../database/repository/UserRepo';
import { SuccessResponse } from '../../core/ApiResponse';
import mongoose from 'mongoose';
import { BadRequestError } from '../../core/ApiError';

const router = express.Router();

router.use(authentication);
router.get(
  '/users',
  asyncHandler(async (req: ProtectedRequest, res) => {
    if (req.user.role !== 'ADMIN') {
      return new BadRequestError(
        'You are not authorized to perform this action',
      );
    }
    const users = await UserRepo.getAllUsers();
    new SuccessResponse('success', users).send(res);
  }),
);
router.patch(
  '/users/:id/plan',
  asyncHandler(async (req: ProtectedRequest, res) => {
    if (req.user.role !== 'ADMIN') {
      return new BadRequestError(
        'You are not authorized to perform this action',
      );
    }
    const { plan_end_date, is_paid_plan } = req.body;
    const users = await UserRepo.updateUserPlan({
      _id: new mongoose.Types.ObjectId(req.params.id),
      plan_end_date,
      is_paid_plan,
    });
    new SuccessResponse('success', users).send(res);
  }),
);

export default router;
