import Joi from "joi";
import authScheme from "../validations/authSchema.js";

const banAUserSchema = Joi.object({
  banType: Joi.string()
    .valid("1week", "1month", "1year", "permanent")
    .required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: authScheme.pwSchema,
  newPassword: authScheme.pwSchema,
  confirmPassword: authScheme.pwSchema,
});

export default { banAUserSchema, changePasswordSchema };
