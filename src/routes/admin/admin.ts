import { ProtectedRequest } from 'app-request';
import express from 'express';
import authentication from '../../auth/authentication';
import asyncHandler from '../../helpers/asyncHandler';
import UserRepo from '../../database/repository/UserRepo';
import { SuccessResponse } from '../../core/ApiResponse';

const router = express.Router();

router.use(authentication);
router.get(
  '/users',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const users = await UserRepo.getAllUsers();
    new SuccessResponse('success', users).send(res);
  }),
);

export default router;
