import { BadRequestError } from '../../core/ApiError';
import Enquiry, { EnquiryModel } from '../model/Enquiry';

async function create(enquiry: Enquiry): Promise<string> {
  try {
    await EnquiryModel.create(enquiry);
    return 'Enquiry created';
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

async function getEnquiriesForBusiness(businessId: string): Promise<Enquiry[]> {
  try {
    const enquiries = await EnquiryModel.find({ business: businessId })
      .lean()
      .exec();
    return enquiries;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

export default {
  create,
  getEnquiriesForBusiness,
};
