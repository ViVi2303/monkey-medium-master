import Joi from "joi";

const createTopicSchema = Joi.object({
  name: Joi.string().min(1).required(),
});

const updateTopicSchema = Joi.object({
  name: Joi.string().min(1),
});

export default { createTopicSchema, updateTopicSchema };
