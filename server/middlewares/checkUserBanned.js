import getError from "../utils/getError.js";

const checkBanned = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.status === "banned") {
      if (user.bannedUntil === null) {
        return res.status(403).json({
          success: false,
          message: `This user have been permanently banned`,
        });
      }

      return res.status(403).json({
        success: false,
        message: `This user have been temporarily banned`,
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

export default checkBanned;
