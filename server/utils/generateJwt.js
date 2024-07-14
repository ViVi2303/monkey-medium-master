import env from "../config/env.js";
import JsonWebToken from "../models/mongodb/JsonWebToken.js";
import jwt from "jsonwebtoken";

const generateJwt = async (payload) => {
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE_TIME,
  });

  const { exp, iat } = jwt.verify(token, env.JWT_SECRET);

  await JsonWebToken.create({ userId: payload.id, token, iat, exp });

  return token;
};

export default generateJwt;
