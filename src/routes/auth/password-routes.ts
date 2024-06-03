import express from 'express';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import { PublicRequest } from 'app-request';
import UserRepo from '../../database/repository/UserRepo';
import { BadRequestError } from '../../core/ApiError';
import crypto from 'crypto';
import JWT, { JwtPayload } from '../../core/JWT';
import { app, sg, tokenInfo } from '../../config';
import sendmail from '../../helpers/sendMail';
import { SuccessResponse } from '../../core/ApiResponse';
import { validateTokenData } from '../../auth/authUtils';
import bcrypt from 'bcrypt';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import { Types } from 'mongoose';

const router = express.Router();

router.post(
  '/forgot',
  validator(schema.forgotPassword),
  asyncHandler(async (req: PublicRequest, res) => {
    const email = req.body.email;

    const user = await UserRepo.findByEmail(email);

    if (!user) {
      throw new BadRequestError('User not registered');
    }

    // Generate reset password token
    const resetPasswordKey = crypto.randomBytes(64).toString('hex');

    const resetPasswordToken = await JWT.encode(
      new JwtPayload(
        tokenInfo.issuer,
        tokenInfo.audience,
        user._id.toString(),
        resetPasswordKey,
        tokenInfo.accessTokenValidity,
      ),
    );

    await UserRepo.updateInfo({
      _id: user._id,
      resetPasswordToken: resetPasswordToken,
    });

    const emailData = {
      from: { email: sg.mailFrom, name: 'MerchantLive' },
      to: user.email,
      subject: 'Reset you password',
      html: `<strong>To reset your password  <a href="${app.clientURL}/reset-password/${resetPasswordToken}"> </a>${app.clientURL}/reset-password/${resetPasswordToken} </strong>`,
    };

    await sendmail(emailData);

    new SuccessResponse('Mail Sent', {}).send(res);
  }),
);

router.post(
  '/reset',
  validator(schema.resetPassword),
  asyncHandler(async (req: PublicRequest, res) => {
    const token = req.body.resetPasswordToken;

    const resetTokenPayload = await JWT.decode(token);
    validateTokenData(resetTokenPayload);

    const user = await UserRepo.findById(
      new Types.ObjectId(resetTokenPayload.sub),
    );

    if (!user) {
      throw new BadRequestError('User not registered');
    }

    if (user.resetPasswordToken !== token) {
      throw new BadRequestError('Invalid reset password token');
    }

    if (user.resetPasswordToken !== token) {
      throw new BadRequestError('Invalid reset password token');
    }

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    await KeystoreRepo.removeAllForClient(user);

    await KeystoreRepo.create(user, accessTokenKey, refreshTokenKey);
    await UserRepo.updateInfo({
      _id: user._id,
      password: passwordHash,
    });

    new SuccessResponse('Password Reset Successful', {}).send(res);
  }),
);

export default router;
