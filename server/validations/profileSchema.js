import Joi from "joi";

const updateProfileSchema = Joi.object({
  fullname: Joi.string().min(3).max(75),
  bio: Joi.string().allow("").max(160),
  about: Joi.string().allow("").max(300),
  avatar: Joi.string(),
});

const setupProfileSchema = Joi.object({
  fullname: Joi.string().min(3).max(75),
});

export default { updateProfileSchema, setupProfileSchema };
