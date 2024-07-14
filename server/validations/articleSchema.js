import Joi from "joi";

const createDraftSchema = Joi.object({
  title: Joi.string().max(250),
  content: Joi.string()
    .allow("")
    .custom((value, helpers) => {
      const imgTagCount = (value.match(/<img/g) || []).length;
      if (imgTagCount > 20) {
        return helpers.message(
          "The max number of images allowed to insert into the article is 20"
        );
      }
      return value;
    }),
});

const updateDraftSchema = Joi.object({
  title: Joi.string().max(250),
  content: Joi.string()
    .allow("")
    .custom((value, helpers) => {
      const imgTagCount = (value.match(/<img/g) || []).length;
      if (imgTagCount > 20) {
        return helpers.message(
          "The max number of images allowed to insert into the article is 20"
        );
      }
      return value;
    }),
});

const createArticleSchema = Joi.object({
  banner: Joi.string(),
  preview: Joi.string().max(200),
  topicNames: Joi.array().max(5).items(Joi.string()),
});

const updateArticleSchema = Joi.object({
  banner: Joi.string(),
  title: Joi.string().max(250),
  preview: Joi.string().max(200),
  content: Joi.string(),
  topicNames: Joi.array().max(5).items(Joi.string()),
});

const setDraftSchema = Joi.object({
  reason: Joi.string().min(4).max(150).allow("").allow(null),
});


export default {
  createDraftSchema,
  updateDraftSchema,
  createArticleSchema,
  updateArticleSchema,
  setDraftSchema,
};
