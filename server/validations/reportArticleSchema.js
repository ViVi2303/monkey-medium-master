import Joi from "joi";

const reportAnArticleSchema = Joi.object({
  reason: Joi.string()
    .valid("Harassment", "Rules Violation", "Spam")
    .required(),
});

export default { reportAnArticleSchema };
