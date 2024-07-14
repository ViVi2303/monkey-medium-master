import { rateLimit } from "express-rate-limit";
import MongoStore from "rate-limit-mongo";
import env from "../config/env.js";

const limiter = ({ windowMs = 1, max = 3 }) => {
  const windowMsInMilliseconds = windowMs * 60 * 1000;
  return rateLimit({
    store: new MongoStore({
      uri: env.getMongodbUri(),
      expireTimeMs: windowMsInMilliseconds,
      errorHandler: console.error.bind(null, "rate-limit-mongo"),
    }),
    windowMs: windowMsInMilliseconds,
    max,
    message: "Too many requests from this IP, please try again later",
    handler: (req, res, next, options) => {
      res.status(options.statusCode).json({
        success: false,
        message: options.message,
      });
    },
  });
};

export default limiter;
