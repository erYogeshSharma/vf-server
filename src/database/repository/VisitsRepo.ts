import { ObjectId } from 'mongoose';
import { BadRequestError } from '../../core/ApiError';
import Visitor, { VisitorModel } from '../model/Visitor';

async function create(visit: Visitor): Promise<string> {
  try {
    await VisitorModel.create(visit);
    return 'Visit created successfully';
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}
async function getVisitsForBusiness(businessId: ObjectId): Promise<Visitor[]> {
  try {
    const visitors = await VisitorModel.find({ business: businessId });
    return visitors;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

export default {
  create,
  getVisitsForBusiness,
};
