import { Types } from 'mongoose';
import { BadRequestError, InternalError } from '../../core/ApiError';
import Enquiry, { EnquiryModel } from '../model/Enquiry';

async function create(enquiry: Enquiry): Promise<string> {
  try {
    await EnquiryModel.create(enquiry);
    return 'Enquiry created';
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

async function getEnquiriesForBusiness(
  businessId: Types.ObjectId,
): Promise<Enquiry[]> {
  try {
    const enquiries = await EnquiryModel.find({ business: businessId })
      .lean()
      .exec();
    return enquiries;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

async function changeEnquiryStatus(
  enquiryId: string,
  status: string,
  business: Types.ObjectId,
): Promise<string> {
  try {
    const enquiryE = await EnquiryModel.findById(enquiryId);
    if (!enquiryE) {
      throw new BadRequestError('Enquiry not found');
    }

    if (enquiryE.business?.toString() !== business.toString()) {
      throw new BadRequestError('User does not have access to this enquiry');
    }

    await EnquiryModel.updateOne(
      { _id: new Types.ObjectId(enquiryId) },
      { isSolved: status },
    );
    return 'Enquiry status updated';
  } catch (error) {
    throw new InternalError(error as string);
  }
}

export default {
  create,
  getEnquiriesForBusiness,
  changeEnquiryStatus,
};
