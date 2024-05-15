import express from 'express';
import { FailureMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import BusinessRepo from '../../database/repository/BusinessRepo';

const router = express.Router();

router.get(
  '/:id',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const { id } = req.params;
    if (!id) {
      return new FailureMsgResponse('Id is required').send(res);
    }

    const business = await BusinessRepo.getBusinessByLinkId(id);

    if (!business) {
      return new FailureMsgResponse('Not found').send(res);
    }
    return new SuccessResponse('success', business).send(res);
  }),
);

export default router;
