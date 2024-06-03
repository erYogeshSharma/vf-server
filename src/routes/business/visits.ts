import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';

import VisitsRepo from '../../database/repository/VisitsRepo';
import moment from 'moment';

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                                GET ALL LINKS                               */
/* -------------------------------------------------------------------------- */
router.get(
  '/:businessId',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const businessId = req.params.businessId;
    const startDate =
      req.query.startDate?.toString() || moment().subtract(1, 'day').toString();
    const endDate = req.query.endDate?.toString() || moment().toString();

    const visits = await VisitsRepo.getVisitsWithFilters(
      businessId,
      startDate,
      endDate,
    );

    return new SuccessResponse('success', visits).send(res);
  }),
);

export default router;
