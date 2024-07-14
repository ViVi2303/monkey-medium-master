import JsonWebToken from "../models/mongodb/JsonWebToken.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

const requiredAuth = async (req, res, next) => {
  const headerToken = req.headers.authorization;
  if (!headerToken || !headerToken.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const token = headerToken.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const tokenDoc = await JsonWebToken.findOne({ token });
  if (!tokenDoc) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const jwtPayLoad = jwt.verify(tokenDoc.token, env.JWT_SECRET);
    req.jwtPayLoad = jwtPayLoad;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

export default requiredAuth;
