import express from 'express';
import { SuccessMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';

import validator from '../../helpers/validator';
import schema from './schema';
import OfferRepo from '../../database/repository/OfferRepo';
import { Types } from 'mongoose';
import { checkBusinessExists } from './middleware';

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                            OFFERS                           */
/* -------------------------------------------------------------------------- */

router.get(
  '/',
  checkBusinessExists,
  asyncHandler(async (req: ProtectedRequest, res) => {
    const offers = await OfferRepo.getOffers(
      req.user.business as Types.ObjectId,
    );
    return new SuccessResponse('success', offers).send(res);
  }),
);

router.post(
  '/',
  validator(schema.addOffer),
  checkBusinessExists,
  asyncHandler(async (req: ProtectedRequest, res) => {
    const offer = await OfferRepo.create({
      business: req.user.business,
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      startsOn: req.body.startsOn,
      endsOn: req.body.endsOn,
    });
    return new SuccessResponse('Offer Created', offer).send(res);
  }),
);

router.patch(
  '/:offerId',
  validator(schema.updateOffer),
  checkBusinessExists,
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOffer = await OfferRepo.updateOffer(
      req.user.business as Types.ObjectId,
      req.body,
    );
    return new SuccessResponse('Offer Updated', updatedOffer).send(res);
  }),
);

router.delete(
  '/:offerId',
  checkBusinessExists,
  asyncHandler(async (req: ProtectedRequest, res) => {
    const businessId = req.params.businessId;
    const offerId = req.params.offerId;
    await OfferRepo.deleteOffer(businessId, offerId);
    return new SuccessMsgResponse('Offer Deleted').send(res);
  }),
);
export default router;
