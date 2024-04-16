import Business, { BusinessModel } from '../model/Business';
import { Types } from 'mongoose';

async function create(business: Business): Promise<Business> {
  const now = new Date();
  business.createdAt = now;
  business.updatedAt = now;
  const createdBusiness = await BusinessModel.create(business);
  return createdBusiness.toObject();
}

async function findUrlIfExists(linkId: string): Promise<Business | null> {
  return BusinessModel.findOne({ linkId: linkId }).lean().exec();
}

export default {
  create,
  findUrlIfExists,
};
