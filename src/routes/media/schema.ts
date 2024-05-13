import Joi from 'joi';

export default {
  fileData: Joi.object().keys({
    key: Joi.string().required(),
    content_type: Joi.string().required(),
  }),
};
