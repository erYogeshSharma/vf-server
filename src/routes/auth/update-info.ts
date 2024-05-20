import express from 'express';
import authentication from '../../auth/authentication';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import UserRepo from '../../database/repository/UserRepo';
import { SuccessResponse } from '../../core/ApiResponse';
import { getUserData } from './utils';

const router = express.Router();

router.use(authentication);

router.patch(
  '/',
  validator(schema.updateInfo),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.updateInfo({
      _id: req.user._id,
      name: req.body.name || req.user.name,
      profilePicUrl: req.body.profilePicUrl || req.user.profilePicUrl,
    });

    console.log({ user });

    const userData = await getUserData(user);
    new SuccessResponse('Update Successful', {
      user: userData,
    }).send(res);
  }),
);

export default router;
