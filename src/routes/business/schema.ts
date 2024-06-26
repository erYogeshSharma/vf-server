import Joi from 'joi';

export default {
  businessCreate: Joi.object().keys({
    logo: Joi.string().required().min(3).max(500),
    linkId: Joi.string().required().min(3).max(50),
    name: Joi.string().required().min(3).max(50),
    category: Joi.string().optional().required().min(3).max(500),
  }),

  basicDetailsUpdate: Joi.object().keys({
    _id: Joi.string().required(),
    logo: Joi.string().required().min(3).max(500),
    coverImage: Joi.string().required().min(3).max(500),

    linkId: Joi.string().required().min(3).max(50),
    name: Joi.string().required().min(3).max(50),
    title: Joi.string().required().min(3).max(500),
    description: Joi.string().required().min(3).max(100000),

    email: Joi.string().required().min(3).max(500),
    phone: Joi.number().required().min(1000000000).max(9999999999),
    alternatePhone: Joi.number().optional().min(1000000000).max(9999999999),

    category: Joi.string().optional().required().min(3).max(500),
  }),

  updateAddress: Joi.object().keys({
    _id: Joi.string().required(),
    address: Joi.string().required().min(3).max(500),
    country: Joi.string().required().min(3).max(500),
    city: Joi.string().required().min(3).max(40),
    state: Joi.string().required().min(3).max(40),
    zipCode: Joi.number().required().min(100000).max(999999),
    googleMapLink: Joi.string().optional().min(3).max(500),
  }),
  /**
   * product:{
   * title: string,
   * image:string,
   * }
   */

  updateProducts: Joi.object().keys({
    _id: Joi.string().required(),
    products: Joi.array()
      .optional()
      .items(
        Joi.object({
          _id: Joi.string().optional(),
          title: Joi.string().required(),
          image: Joi.string().required(),
          description: Joi.string().required(),
        }),
      ),
  }),

  updateGallery: Joi.object().keys({
    _id: Joi.string().required(),
    gallery: Joi.array().optional().items(Joi.string()).has(Joi.string()),
  }),

  updateLinks: Joi.object().keys({
    _id: Joi.string().required(),
    links: Joi.array()
      .optional()
      .items(
        Joi.object({
          _id: Joi.string().optional(),
          type: Joi.string(),
          link: Joi.string(),
        }),
      ),
  }),

  updateSettings: Joi.object().keys({
    _id: Joi.string().required(),
    enableEnquiryForm: Joi.boolean().optional(),
    enableAppointmentForm: Joi.boolean().optional(),
    theme: Joi.string().optional(),
  }),
  updateCalender: Joi.object().keys({
    _id: Joi.string().required(),
    calender: Joi.string().required(),
  }),

  addLinkIcon: Joi.object().keys({
    title: Joi.string().required(),
    category: Joi.string().optional(),
    icon: Joi.string().optional().uri(),
  }),
  checkLinkAvailable: Joi.object().keys({
    linkId: Joi.string().required(),
  }),

  /* -------------------------------------------------------------------------- */
  /*                                   CLIENT                                   */
  /* -------------------------------------------------------------------------- */
  addEnquiry: Joi.object().keys({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().required().min(3).max(500),
    contact: Joi.number().required().min(1000000000).max(9999999999),
    message: Joi.string().required().min(3).max(100000),
  }),

  logVisit: Joi.object().keys({
    ip: Joi.string().required().min(3).max(50),
    userAgent: Joi.string().required().min(3).max(500),
  }),
  /* -------------------------------------------------------------------------- */
  /*                                 OFFER                                */
  /* -------------------------------------------------------------------------- */
  updateEnquiryStatus: Joi.object().keys({
    isSolved: Joi.boolean().required(),
  }),

  addOffer: Joi.object().keys({
    title: Joi.string().required().min(3).max(50),
    description: Joi.string().required().min(3).max(500),
    image: Joi.string().required().min(3).max(500),
    startsOn: Joi.date().required(),
    endsOn: Joi.date().required(),
  }),
  updateOffer: Joi.object().keys({
    _id: Joi.string().required(),
    title: Joi.string().optional().min(3).max(50),
    description: Joi.string().optional().min(3).max(500),
    image: Joi.string().optional().min(3).max(500),
    isActive: Joi.boolean().optional(),
    startsOn: Joi.date().optional(),
    endsOn: Joi.date().optional(),
  }),
};
