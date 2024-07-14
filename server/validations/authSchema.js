import Joi from "joi";

const pwSchema = Joi.string().min(6).required();
const emailSchema = Joi.string().email().required();

const registerSchema = Joi.object({
  email: emailSchema,
  password: pwSchema,
});

const loginSchema = Joi.object({
  email: emailSchema,
  password: pwSchema,
});

const verifyTokenSchema = Joi.object({
  token: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: emailSchema,
});

const resetPasswordSchema = Joi.object({
  newPassword: pwSchema,
  confirmPassword: pwSchema,
});

export default {
  registerSchema,
  loginSchema,
  verifyTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  emailSchema,
  pwSchema,
};
