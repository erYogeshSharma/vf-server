import express from 'express';
import authentication from '../../auth/authentication';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import FeedbackRepo from '../../database/repository/FeedbackRepo';
import { SuccessMsgResponse } from '../../core/ApiResponse';

const router = express.Router();

router.use(authentication);

router.post(
  '/feedback',
  validator(schema.feedback),
  asyncHandler(async (req: ProtectedRequest, res) => {
    await FeedbackRepo.create({
      user: req.user,
      message: req.body.message,
    });

    new SuccessMsgResponse('Feedback saved successfully').send(res);
  }),
);

export default router;
