import Joi from 'joi';

export default {
  businessCreate: Joi.object().keys({
    linkId: Joi.string().required().min(3).max(50),
    name: Joi.string().required().min(3).max(50),
    title: Joi.string().required().min(3).max(500),
    description: Joi.string().required().min(3).max(100000),
    logo: Joi.string().required().min(3).max(500),
    coverImage: Joi.string().required().min(3).max(500),

    email: Joi.string().required().min(3).max(500),
    phone: Joi.number().required().min(10).max(12),
    alternatePhone: Joi.number().required().min(10).max(12),

    address: Joi.string().optional().min(3).max(500),
    country: Joi.string().optional().min(3).max(500),
    city: Joi.string().optional().min(3).max(500),
    state: Joi.string().optional().min(3).max(500),
    zipCode: Joi.number().optional().min(3).max(500),

    industry: Joi.string().optional().required().min(3).max(500),

    enableEnquiryForm: Joi.boolean().optional(),
    enableAppointmentForm: Joi.boolean().optional(),

    links: Joi.array()
      .optional()
      .items(
        Joi.object({
          type: Joi.string(),
          link: Joi.string(),
        }),
      )
      .has(Joi.object({ type: Joi.string(), link: Joi.string() })),
  }),
};
