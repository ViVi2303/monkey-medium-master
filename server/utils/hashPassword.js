import bcrypt from "bcryptjs";

const hashPassword = (password) => {
  if (!password) {
    throw new Error("Can not hash empty password");
  }

  const salt = bcrypt.genSaltSync(12);

  const hashedPassword = bcrypt.hashSync(password, salt);

  return hashedPassword;
};

export default hashPassword;
