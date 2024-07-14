import getError from "../utils/getError.js";

const authorize =
  (...role) =>
  (req, res, next) => {
    try {
      const me = req.me;

      if (!role.includes(me.role.slug)) {
        return res.status(403).json({
          success: false,
          message: "No Permission",
        });
      }

      next();
    } catch (error) {
      const err = getError(error);
      return res.status(err.code).json({
        success: false,
        message: err.message,
      });
    }
  };

export default authorize;
