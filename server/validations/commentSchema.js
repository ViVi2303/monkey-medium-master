import Joi from "joi";

const createCommentSchema = Joi.object({
  parentCommentId: Joi.number().optional().allow(null).allow(""),
  content: Joi.string().min(3).max(150).required(),
});

const updateCommentSchema = Joi.object({
  content: Joi.string().min(3).max(150).required(),
});

export default { createCommentSchema, updateCommentSchema };
