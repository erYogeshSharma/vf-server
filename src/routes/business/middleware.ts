import { ProtectedRequest } from 'app-request';
import { BadRequestError } from '../../core/ApiError';
import { NextFunction, Response } from 'express';

export function checkBusinessExists(
  req: ProtectedRequest,
  _: Response,
  next: NextFunction,
) {
  if (!req.user.business) {
    return new BadRequestError('User does not have a business');
  }
  next();
}
