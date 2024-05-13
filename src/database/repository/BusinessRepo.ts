import { BadRequestError } from '../../core/ApiError';
import Business, { BusinessModel } from '../model/Business';

async function create(business: Business): Promise<Business> {
  const createdBusiness = await BusinessModel.create(business);
  return createdBusiness.toObject();
}

async function update(
  userId: string,
  business: Business,
): Promise<Business | null> {
  console.log(business);
  try {
    const updatedBusiness = await BusinessModel.findOneAndUpdate(
      { user: userId, _id: business._id },
      business,
      { new: true },
    )
      .lean()
      .exec();

    console.log(updatedBusiness);
    return updatedBusiness;
  } catch (error) {
    console.log(error);
    throw new BadRequestError(error as string);
  }
}

async function findUrlIfExists(linkId: string): Promise<Business | null> {
  const business = await BusinessModel.findOne({ linkId: linkId })
    .lean()
    .exec();
  return business;
}

async function getBusinessById(id: string): Promise<Business | null> {
  const business = await BusinessModel.findById(id).lean().exec();
  return business;
}
async function getAllUserBusiness(userId: string): Promise<Business[]> {
  //only select the fields that are needed

  const businesses = await BusinessModel.find({ user: userId })
    .select('logo coverImage name linkId isActive title')
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
    const updatedBusiness = await BusinessModel.findOneAndUpdate(
      { user: userId, businessId: products._id },
      {
        products: products.products,
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

async function updateLinks(
  userId: string,
  links: { _id: string; links: { type: string; link: string }[] },
): Promise<Business | null> {
  try {
    const updatedBusiness = await BusinessModel.findOneAndUpdate(
      { user: userId, businessId: links._id },
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
      { user: userId, businessId: gallery._id },
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
  },
): Promise<Business | null> {
  try {
    const updatedBusiness = await BusinessModel.findOneAndUpdate(
      { user: userId, businessId: settings._id },
      {
        enableEnquiryForm: settings.enableEnquiryForm,
        enableAppointmentForm: settings.enableAppointmentForm,
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
};
