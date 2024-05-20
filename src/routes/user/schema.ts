import Joi from 'joi';

export default {
  feedback: Joi.object().keys({
    message: Joi.string().required(),
  }),
};
