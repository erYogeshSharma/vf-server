import express from 'express';
import { FailureMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import BusinessRepo from '../../database/repository/BusinessRepo';
import VisitsRepo from '../../database/repository/VisitsRepo';

const router = express.Router();

router.get(
  '/:id',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const { id } = req.params;
    const { demo } = req.query;
    if (!id) {
      return new FailureMsgResponse('Id is required').send(res);
    }

    //get the ip address and user agent from req

    const business = await BusinessRepo.getBusinessByLinkId(id);

    if (!business) {
      return new FailureMsgResponse('Not found').send(res);
    }

    //SAVE THE VISIT IF NOT DEMO
    if (!demo) {
      const ip = req.ip as string;
      const userAgent = req.get('User-Agent') as string;

      await VisitsRepo.create({
        business: business,
        ip,
        userAgent,
        visitedOn: new Date(),
      });
    }

    return new SuccessResponse('success', business).send(res);
  }),
);

export default router;
