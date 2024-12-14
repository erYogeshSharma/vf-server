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
      from: { email: sg.mailFrom, name: 'BharatBizPortal' },
      to: user.email,
      subject: 'Reset Your Password',
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
          color: #333333;
          line-height: 1.5;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 5px;
        }
        .header {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 20px;
        }
        .content {
          font-size: 16px;
          margin-bottom: 20px;
        }
        .btn {
          display: block;
          width: fit-content;
          margin: 0 auto 20px auto;
          padding: 10px 20px;
          background-color: #007BFF;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          text-align: center;
          font-size: 16px;
        }
        .btn:hover {
          background-color: #0056b3;
        }
        .footer {
          font-size: 12px;
          text-align: center;
          color: #888888;
          margin-top: 20px;
        }
        .link-text{
          font-size: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Reset Your Password</div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset your password for your BharatBizPortal account. Please click the button below to reset it:</p>
          <a href="${app.clientURL}/reset-password/${resetPasswordToken}" class="btn">Reset Password</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>Alternatively, you can copy and paste this link into your browser:</p>
          <p><a class='link-text' href="${app.clientURL}/reset-password/${resetPasswordToken}">${app.clientURL}/reset-password/${resetPasswordToken}</a></p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} BharatBizPortal. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `,
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
