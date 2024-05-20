import express from 'express';
import authentication from '../../auth/authentication';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import bcrypt from 'bcrypt';
import { BadRequestError } from '../../core/ApiError';
import UserRepo from '../../database/repository/UserRepo';
import { SuccessResponse } from '../../core/ApiResponse';

const router = express.Router();

router.use(authentication);

router.patch(
  '/',
  validator(schema.updatePassword),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const match = await bcrypt.compare(
      req.body.oldPassword,
      req.user.password as string,
    );

    if (!match) {
      throw new BadRequestError('Invalid Current Password');
    }

    const newPasswordHash = await bcrypt.hash(req.body.newPassword, 10);
    await UserRepo.updateInfo({
      _id: req.user._id,
      password: newPasswordHash,
    });

    new SuccessResponse('Password Updated Successful', {}).send(res);
  }),
);

export default router;
