import { Types } from 'mongoose';
import { BadRequestError } from '../../core/ApiError';
import Offer, { OfferModel } from '../model/offer';

async function create(offer: Partial<Offer>): Promise<Offer> {
  try {
    const newOffer = await OfferModel.create(offer);
    return newOffer;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

async function updateOffer(
  businessId: Types.ObjectId,
  offer: Offer,
): Promise<Offer | null> {
  try {
    const updatedOffer = await OfferModel.findOneAndUpdate(
      { business: businessId, _id: offer._id },
      offer,
      {
        new: true,
      },
    );

    return updatedOffer;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

export const deleteOffer = async (
  businessId: string,
  offerId: string,
): Promise<string> => {
  try {
    await OfferModel.deleteOne({
      business: businessId,
      _id: offerId,
    });
    return 'Deleted';
  } catch (error) {
    throw new BadRequestError(error as string);
  }
};

export const getOffers = async (
  businessId: Types.ObjectId,
): Promise<Offer[]> => {
  try {
    const offers = await OfferModel.find({ business: businessId });
    return offers;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
};
export default {
  create,
  updateOffer,
  getOffers,
  deleteOffer,
};
