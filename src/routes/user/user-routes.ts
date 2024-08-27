import express from 'express';
import authentication from '../../auth/authentication';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import bcrypt from 'bcrypt';
import { BadRequestError } from '../../core/ApiError';
import UserRepo from '../../database/repository/UserRepo';
import { SuccessMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import { getUserData } from '../auth/utils';
import FeedbackRepo from '../../database/repository/FeedbackRepo';
import { sg } from '../../config';
import sendmail from '../../helpers/sendMail';

const router = express.Router();

router.use(authentication);

//CHANGE PASSWORD
router.patch(
  '/password',
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

//UPDATE USER PROFILE
router.patch(
  '/profile',
  validator(schema.updateInfo),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.updateInfo({
      _id: req.user._id,
      name: req.body.name || req.user.name,
      profilePicUrl: req.body.profilePicUrl || req.user.profilePicUrl,
    });

    ({ user });

    const userData = await getUserData(user);
    new SuccessResponse('Update Successful', {
      user: userData,
    }).send(res);
  }),
);

//GIVE FEEDBACK
router.post(
  '/feedback',
  validator(schema.feedback),
  asyncHandler(async (req: ProtectedRequest, res) => {
    await FeedbackRepo.create({
      user: req.user._id,
      message: req.body.message,
    });

    const emailData = {
      from: { email: sg.mailFrom, name: 'MerchantLive' },
      to: 'er.yogeshsharma505@gmail.com',
      subject: `Feedback from ${req.user.email} `,
      html: ` <div> <p>  <strong>Feedback from ${req.user.name} </strong> <p/> <br/>  ${req.body.message}   <div> `,
    };
    await sendmail(emailData);
    new SuccessMsgResponse('Feedback saved successfully').send(res);
  }),
);

//GET REFERRALS
router.get(
  '/referrals',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const referrals = await UserRepo.getReferrals(req.user._id);
    new SuccessResponse('success', referrals).send(res);
  }),
);

export default router;
