import Block from "../models/mysql/Block.js";

const checkBlockByUser = async (req, res, next) => {
  try {
    const me = req.me ? req.me : null;
    const user = req.user;

    if (me && me.id !== user.id) {
      const isBlockedByUser = !!(await Block.findOne({
        where: { blockedId: me.profileInfo.id, blockerId: user.profileInfo.id },
      }));

      if (isBlockedByUser) {
        return res.status(403).json({
          success: false,
          message: `You have been blocked by ${user.profileInfo.fullname}`,
        });
      }
    }

    next();
  } catch (error) {
    const err = getError(error);
    return res.status(err.code).json({
      success: true,
      message: err.message,
    });
  }
};

export default checkBlockByUser;
