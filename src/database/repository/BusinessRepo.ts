import { Types } from 'mongoose';
import { BadRequestError } from '../../core/ApiError';
import Business, { BusinessModel } from '../model/Business';
import UserRepo from './UserRepo';
import Offer, { OfferModel } from '../model/offer';

//CREATE A BUSINESS
async function create(business: Partial<Business>): Promise<Business> {
  const createdBusiness = (await BusinessModel.create(business)).toObject();

  //ONE USER HAS ONLY ONE BUSINESS
  await UserRepo.updateInfo({
    _id: new Types.ObjectId(createdBusiness.user),
    business: createdBusiness._id,
  });

  return createdBusiness;
}

async function update(
  userId: string,
  business: Business,
): Promise<Business | null> {
  try {
    const updatedBusiness = await BusinessModel.findOneAndUpdate(
      { user: userId, _id: business._id },
      business,
      { new: true },
    )
      .lean()
      .exec();
    return updatedBusiness;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

async function findUrlIfExists(linkId: string): Promise<Business | null> {
  const business = await BusinessModel.findOne({ linkId: linkId })
    .lean()
    .exec();
  return business;
}

async function getBusinessById(id: Types.ObjectId): Promise<Business | null> {
  try {
    const business = await BusinessModel.findById(id).lean().exec();
    return business;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

async function getBusinessByLinkId(linkId: string): Promise<Business | null> {
  try {
    const business = (await BusinessModel.findOne({
      linkId: linkId,
    })
      .populate('links.type', 'icon title')
      .lean()
      .exec()) as Business & { offer?: Offer };

    const activeOffer = await OfferModel.findOne({
      business: business?._id,
      isActive: true,
    });

    if (activeOffer) {
      business.offer = activeOffer;
    }

    return business;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

async function getAllUserBusiness(userId: Types.ObjectId): Promise<Business[]> {
  //only select the fields that are needed

  const businesses = await BusinessModel.find({ user: userId })
    .select('logo coverImage name linkId isActive title theme')
    .lean()
    .exec();
  return businesses;
}

async function updateAddress(
  userId: string,
  address: Partial<Business>,
): Promise<Business | null> {
  try {
    const updatedBusiness = await BusinessModel.findOneAndUpdate(
      { user: userId, _id: address._id },
      {
        address: address.address,
        country: address.country,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        googleMapLink: address.googleMapLink,
      },
      { new: true },
    )
      .lean()
      .exec();

    return updatedBusiness;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

async function updateProducts(
  userId: string,
  products: { _id: string; products: { title: string; image: string }[] },
): Promise<Business | null> {
  try {
    // Perform the update
    const updatedBusiness = await BusinessModel.findOneAndUpdate(
      { user: userId, _id: products._id },
      { products: products.products },
      { new: true },
    )
      .lean()
      .exec();

    return updatedBusiness;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

async function updateLinks(
  userId: string,
  links: { _id: string; links: { type: string; link: string }[] },
): Promise<Business | null> {
  try {
    const updatedBusiness = await BusinessModel.findOneAndUpdate(
      { user: userId, _id: links._id },
      {
        links: links.links,
      },
      { new: true },
    )
      .lean()
      .exec();

    return updatedBusiness;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

async function updateGallery(
  userId: string,
  gallery: { _id: string; gallery: string[] },
): Promise<Business | null> {
  try {
    const updatedBusiness = await BusinessModel.findOneAndUpdate(
      { user: userId, _id: gallery._id },
      {
        gallery: gallery.gallery,
      },
      { new: true },
    )
      .lean()
      .exec();
    return updatedBusiness;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

async function updateSettings(
  userId: string,
  settings: {
    _id: string;
    enableEnquiryForm: boolean;
    enableAppointmentForm: boolean;
    theme: string;
  },
): Promise<Business | null> {
  try {
    const updatedBusiness = await BusinessModel.findOneAndUpdate(
      { user: userId, _id: settings._id },
      {
        enableEnquiryForm: settings.enableEnquiryForm,
        enableAppointmentForm: settings.enableAppointmentForm,
        theme: settings.theme,
      },
      { new: true },
    )

      .lean()
      .exec();
    return updatedBusiness;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

async function updateCalender(
  userId: string,
  calender: { _id: string; calender: string },
): Promise<Business | null> {
  try {
    const updatedBusiness = await BusinessModel.findOneAndUpdate(
      { user: userId, _id: calender._id },
      {
        calender: calender.calender,
      },
      { new: true },
    )
      .lean()
      .exec();
    return updatedBusiness;
  } catch (error) {
    throw new BadRequestError(error as string);
  }
}

export default {
  update,
  create,
  findUrlIfExists,
  getAllUserBusiness,
  getBusinessById,
  updateAddress,
  updateLinks,
  updateProducts,
  updateGallery,
  updateSettings,
  getBusinessByLinkId,
  updateCalender,
};
