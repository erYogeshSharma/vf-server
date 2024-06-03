import Joi from 'joi';

export default {
  feedback: Joi.object().keys({
    message: Joi.string().required(),
  }),
  updatePassword: Joi.object().keys({
    oldPassword: Joi.string().required().min(6),
    newPassword: Joi.string().required().min(6),
  }),

  updateInfo: Joi.object().keys({
    profilePicUrl: Joi.string().optional(),
    name: Joi.string().optional(),
  }),
};
