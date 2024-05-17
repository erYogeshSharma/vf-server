import Joi from 'joi';

export default {
  addEnquiry: Joi.object().keys({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().required().min(3).max(500),
    contact: Joi.number().required().min(1000000000).max(9999999999),
    message: Joi.string().required().min(3).max(100000),
  }),
};
